import type { Feature } from 'geojson';
import type { Layer, Map as LeafletMap } from 'leaflet';
import { publicContent } from '../../services/publicContent';
import { getLayerStatus, type MapLayer } from '../../services/projectGeography';

type LeafletLibrary = typeof import('leaflet');
const STATUS_COLORS: Record<string, string> = {
  Generation: '#00b82e',
  'Under Construction': '#f27a11',
  'PPA Stage': '#0804fb',
  'Feasibility Stage': '#8056b3',
  Ongoing: '#008d99',
  'Not specified': '#68756d',
};

function createPopup(feature: Feature, record: MapLayer) {
  const project = publicContent.projects.find((item) => item.slug === record.projectSlug);
  const popup = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = String(feature.properties?.name || record.name);
  popup.append(heading);
  const caption = document.createElement('p');
  caption.textContent = project
    ? [project.capacity, project.status].filter(Boolean).join(' · ')
    : getLayerStatus(record);
  popup.append(caption);
  if (project) {
    const link = document.createElement('a');
    link.href = '/project/' + project.slug;
    link.textContent = 'Explore project ↗';
    popup.append(link);
  } else if (record.id.startsWith('reference-')) {
    const note = document.createElement('p');
    note.textContent = 'Detailed project profile not available yet.';
    popup.append(note);
  }
  const source = document.createElement('small');
  source.textContent = record.source;
  popup.append(source);
  return popup;
}

function addBaseMaps(L: LeafletLibrary, map: LeafletMap) {
  const street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 19,
      attribution:
        'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    },
  );
  return { OpenStreetMap: street, Satellite: satellite };
}

function addProjectLayers(L: LeafletLibrary, map: LeafletMap, records: MapLayer[]) {
  const overlays: Record<string, Layer> = {};
  const bounds = L.latLngBounds([]);
  for (const record of records) {
    const status = getLayerStatus(record);
    const color = STATUS_COLORS[status] || '#0804fb';
    if (!overlays[status]) overlays[status] = L.layerGroup().addTo(map);
    const features = L.geoJSON(record.geojson, {
      style: { color, weight: 3, fillOpacity: 0.12 },
      pointToLayer: (_feature, point) =>
        L.circleMarker(point, {
          radius: 7,
          color: '#fff',
          weight: 2,
          fillColor: color,
          fillOpacity: 1,
        }),
      onEachFeature: (feature, layer) => layer.bindPopup(createPopup(feature, record)),
    });
    (overlays[status] as import('leaflet').LayerGroup).addLayer(features);
    if (features.getBounds().isValid()) bounds.extend(features.getBounds());
  }
  if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
  return overlays;
}

export function createProjectMap(
  L: LeafletLibrary,
  element: HTMLElement,
  records: MapLayer[],
  showFilters: boolean,
) {
  const map = L.map(element, { scrollWheelZoom: false, zoomSnap: 0.5 }).setView(
    [28.3949, 84.124],
    7,
  );
  const baseMaps = addBaseMaps(L, map);
  const overlays = addProjectLayers(L, map, records);
  if (showFilters) L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  return map;
}
