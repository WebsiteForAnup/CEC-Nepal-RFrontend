import source from '../data/mygeodata/all_projects.json';
import relationships from '../data/geography/project-map-links.json';
import { publicContent } from './publicContent';
import type { FeatureCollection, Feature, Geometry } from 'geojson';

export type MapLayer = {
  id: string;
  projectSlug: string;
  name: string;
  geojson: FeatureCollection;
  source: string;
  status?: string;
  kmlUrl?: string;
};
type ReferenceFeature = (typeof source.features)[number];

function hasCoordinates(feature: ReferenceFeature) {
  if (feature.geometry.type !== 'Point') return true;
  const [longitude, latitude] = feature.geometry.coordinates;
  return longitude !== 0 || latitude !== 0;
}

function getReferenceStatus(feature: ReferenceFeature) {
  return (
    feature.properties.description.match(/<b>Status:<\/b>\s*([^<]+)/i)?.[1].trim() ||
    'Not specified'
  );
}

function normalizeStatus(status: string) {
  const knownStatuses: Record<string, string> = {
    generation: 'Generation',
    'ppa stage': 'PPA Stage',
    'under construction': 'Under Construction',
    'testing and commisioning': 'Testing and Commissioning',
    'testing and commissioning': 'Testing and Commissioning',
    'feasibility stage': 'Feasibility Stage',
  };
  return knownStatuses[status.trim().toLowerCase()] || status.trim();
}

function buildReferenceLayer(
  featureNumber: number,
  originalFeatures: ReferenceFeature[],
): MapLayer {
  const link = relationships.links.find((item) => item.featureNumber === featureNumber);
  const project = publicContent.projects.find((item) => item.slug === link?.projectSlug);
  const name = project?.name || originalFeatures[0].properties.Name.replace(/^\d+\.\s*/, '');
  const projectSlug = project?.slug || '';
  const features: Feature[] = originalFeatures.filter(hasCoordinates).map((feature) => ({
    type: 'Feature',
    geometry: feature.geometry as Geometry,
    properties: { name, projectSlug },
  }));

  return {
    id: 'reference-' + featureNumber,
    projectSlug,
    name,
    status: project?.status || getReferenceStatus(originalFeatures[0]),
    geojson: { type: 'FeatureCollection', features },
    source: relationships.source,
  };
}

function buildReferenceLayers() {
  const groups = new Map<number, ReferenceFeature[]>();
  for (const feature of source.features) {
    const number = Number(feature.properties.Name.split('.')[0]);
    const group = groups.get(number) || [];
    group.push(feature);
    groups.set(number, group);
  }
  return [...groups].map(([number, features]) => buildReferenceLayer(number, features));
}

// A profile link is optional. Its absence must never discard geographic data.
export const referenceLayers = buildReferenceLayers();

export function getLayerStatus(layer: MapLayer) {
  const project = publicContent.projects.find((item) => item.slug === layer.projectSlug);
  return normalizeStatus(project?.status || layer.status || 'Not specified');
}
export async function loadUploadedLayers(signal?: AbortSignal): Promise<MapLayer[]> {
  if (!import.meta.env.VITE_NEON_DATA_API_URL)
    throw new Error('Uploaded map layers are not configured. Reference data remains visible.');
  // The existing client obtains a Neon anonymous JWT when there is no session.
  // Import only in the browser, keeping auth and Leaflet out of SSR execution.
  const { neonClient } = await import('../lib/auth');
  if (signal?.aborted) return [];
  const { data: rows, error } = await neonClient
    .schema('public')
    .from('project_map_layers')
    .select('id,project_slug,name,geojson,kml_url')
    .eq('is_published', true)
    .order('created_at', { ascending: true })
    .abortSignal(signal || new AbortController().signal);
  if (error) throw new Error('Uploaded map layers could not be loaded. Showing reference data.');
  return (rows || []).map((row: any) => ({
    id: row.id,
    projectSlug: row.project_slug,
    name: row.name,
    geojson: row.geojson,
    source: 'Uploaded KML',
    kmlUrl: row.kml_url,
  }));
}
