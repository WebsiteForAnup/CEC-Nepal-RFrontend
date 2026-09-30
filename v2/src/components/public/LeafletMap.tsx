import { useEffect, useRef, useState } from 'react';
import type { Map as Leaflet } from 'leaflet';
import type { MapLayer } from '../../services/projectGeography';
import { createProjectMap } from './leafletMapHelpers';
import 'leaflet/dist/leaflet.css';

type MapProps = { layers: MapLayer[]; label?: string; showFilters?: boolean };
export default function LeafletMap({
  layers,
  label = 'Interactive project map',
  showFilters = false,
}: MapProps) {
  const element = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let map: Leaflet | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let cancelled = false;
    async function initializeMap() {
      try {
        const L = await import('leaflet');
        if (cancelled || !element.current) return;
        map = createProjectMap(L, element.current, layers, showFilters);
        resizeObserver = new ResizeObserver(() => map?.invalidateSize());
        resizeObserver.observe(element.current);
      } catch {
        if (!cancelled)
          setError('The interactive map could not load. Project links remain available below.');
        map?.remove();
      }
    }
    setError('');
    void initializeMap();
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      map?.remove();
    };
  }, [layers, showFilters]);
  return (
    <div className="cec-map-shell">
      <div ref={element} className="cec-map-canvas" role="region" aria-label={label} />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
