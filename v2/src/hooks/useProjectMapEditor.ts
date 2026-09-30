import { useEffect, useMemo, useRef, useState } from 'react';
import { publicContent } from '../services/publicContent';
import { parseKml, MAX_KML_BYTES } from '../services/kml';
import { projectMapAdminService, type MapLayerRow } from '../services/projectMapAdminService';
import type { FeatureCollection } from 'geojson';

export default function useProjectMapEditor() {
  const [project, setProject] = useState(publicContent.projects[0].slug);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [rows, setRows] = useState<MapLayerRow[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const selection = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const layers = useMemo(
    () =>
      geojson
        ? [
            {
              id: 'preview',
              projectSlug: project,
              name,
              geojson,
              source: 'Unpublished KML preview',
            },
          ]
        : [],
    [geojson, project, name],
  );
  async function reloadLayers() {
    try {
      setRows(await projectMapAdminService.list());
    } catch (error) {
      setError((error as Error).message);
    }
  }
  useEffect(() => {
    void reloadLayers();
  }, []);
  async function chooseKmlFile(candidate?: File) {
    const version = ++selection.current;
    setFile(null);
    setGeojson(null);
    setError('');
    setMessage('');
    setWarnings([]);
    if (!candidate) return;
    try {
      if (!/\.kml$/i.test(candidate.name))
        throw new Error('Choose a .kml file. KMZ archives are not supported.');
      if (candidate.size > MAX_KML_BYTES) throw new Error('KML must be 5 MB or smaller.');
      const result = parseKml(await candidate.text());
      if (version !== selection.current) return;
      setFile(candidate);
      setGeojson(result.geojson);
      setWarnings(result.warnings);
      setName(candidate.name.replace(/\.kml$/i, ''));
    } catch (error) {
      if (version === selection.current) setError((error as Error).message);
    }
  }
  async function publish(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !geojson || busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await projectMapAdminService.publish(file, project, name.trim(), geojson, setProgress);
      setMessage('KML published. The layer is now available on the project map.');
      setFile(null);
      setGeojson(null);
      if (input.current) input.current.value = '';
      await reloadLayers();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function toggleLayerVisibility(row: MapLayerRow) {
    setBusy(true);
    setError('');
    try {
      await projectMapAdminService.setPublished(row.id, !row.is_published);
      await reloadLayers();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return {
    project,
    setProject,
    name,
    setName,
    file,
    geojson,
    warnings,
    rows,
    error,
    message,
    busy,
    progress,
    input,
    layers,
    chooseKmlFile,
    publish,
    toggleLayerVisibility,
  };
}
