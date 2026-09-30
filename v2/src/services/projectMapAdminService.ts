import { neonClient } from '../lib/auth';
import { uploadToB2 } from './b2Service';
import type { FeatureCollection } from 'geojson';
export type MapLayerRow = {
  id: string;
  project_slug: string;
  name: string;
  geojson: FeatureCollection;
  kml_url: string;
  file_name: string;
  is_published: boolean;
  created_at: string;
};
export const projectMapAdminService = {
  async list(): Promise<MapLayerRow[]> {
    const { data, error } = await neonClient
      .schema('public')
      .from('project_map_layers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error)
      throw new Error(
        error.code === 'PGRST205' || error.code === '42P01'
          ? 'Map table is not ready. Run v2/scripts/project-map-schema.sql in the Neon Console SQL editor once, then reload this page.'
          : 'Could not load map layers. ' + error.message,
      );
    return data || [];
  },
  async publish(
    file: File,
    projectSlug: string,
    name: string,
    geojson: FeatureCollection,
    progress: (value: number) => void,
  ) {
    // Check table access before writing an asset to B2. Do not silently use localStorage.
    await this.list();
    const result = await uploadToB2(
      new File([file], file.name, { type: 'application/vnd.google-earth.kml+xml' }),
      'projects/' + projectSlug + '/kml',
      progress,
    );
    const { error } = await neonClient.schema('public').from('project_map_layers').insert({
      project_slug: projectSlug,
      name,
      geojson,
      kml_url: result.publicUrl,
      file_name: result.fileName,
    });
    if (error)
      throw new Error(
        'The file reached B2 but its map record could not be saved. File: ' +
          result.fileName +
          '. ' +
          error.message,
      );
  },
  async setPublished(id: string, published: boolean) {
    const { error, data } = await neonClient
      .schema('public')
      .from('project_map_layers')
      .update({ is_published: published })
      .eq('id', id)
      .select('id');
    if (error) throw new Error(error.message);
    if (!data?.length) throw new Error('This layer can only be changed by its uploader.');
  },
};
