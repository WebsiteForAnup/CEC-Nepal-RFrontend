import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LeafletMap from './LeafletMap';
import {
  referenceLayers,
  loadUploadedLayers,
  type MapLayer,
  getLayerStatus,
} from '../../services/projectGeography';
import { publicContent } from '../../services/publicContent';
type GeographyProps = {
  projectSlugs?: string[];
  includeUnlinked?: boolean;
  query?: string;
  status?: string;
  showFilters?: boolean;
};

function matchesProjectSelection(layer: MapLayer, selection: GeographyProps) {
  if (layer.projectSlug)
    return !selection.projectSlugs || selection.projectSlugs.includes(layer.projectSlug);
  if (!selection.includeUnlinked) return false;
  const matchesName = layer.name.toLowerCase().includes((selection.query || '').toLowerCase());
  const matchesStatus = !selection.status || getLayerStatus(layer) === selection.status;
  return matchesName && matchesStatus;
}

export default function ProjectGeography(props: GeographyProps) {
  const {
    projectSlugs,
    includeUnlinked = false,
    query = '',
    status = '',
    showFilters = false,
  } = props;
  const [uploads, setUploads] = useState<MapLayer[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    loadUploadedLayers(controller.signal)
      .then(setUploads)
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, []);
  const layers = useMemo(
    () =>
      [...referenceLayers, ...uploads].filter((layer) =>
        matchesProjectSelection(layer, { projectSlugs, includeUnlinked, query, status }),
      ),
    [uploads, projectSlugs, includeUnlinked, query, status],
  );
  const projects = publicContent.projects.filter((project) =>
    layers.some((layer) => layer.projectSlug === project.slug),
  );
  return (
    <section className="cec-project-map">
      <p className="cec-eyebrow">OUR FOOTPRINT</p>
      <h2>
        {!showFilters && projectSlugs?.length === 1
          ? 'Project geography'
          : 'Explore our projects across Nepal.'}
      </h2>
      <p>
        Zoom and select a feature to explore its project. Legacy shapes are reference geometry, not
        surveyed boundaries.
      </p>
      <LeafletMap layers={layers} showFilters={showFilters} />
      {error && <p role="status">{error}</p>}
      {!layers.length && <p>Geographic data has not been published for this project yet.</p>}
      <div className="cec-map-legend">
        <span>● Generation</span>
        <span>● Under construction</span>
        <span>● Other stages</span>
      </div>
      <nav className="cec-map-project-links" aria-label="Projects on the map">
        {projects.map((project) => (
          <Link key={project.slug} to={'/project/' + project.slug}>
            {project.name} ↗
          </Link>
        ))}
      </nav>
      {includeUnlinked && (
        <details className="cec-map-reference-list">
          <summary>
            More mapped projects ({layers.filter((layer) => !layer.projectSlug).length})
          </summary>
          <p>These geographic records do not have a detailed project profile yet.</p>
          <ul>
            {layers
              .filter((layer) => !layer.projectSlug)
              .map((layer) => (
                <li key={layer.id}>
                  {layer.name} · {getLayerStatus(layer)}
                  {!layer.geojson.features.length && ' · Location data not available'}
                </li>
              ))}
          </ul>
        </details>
      )}
    </section>
  );
}
