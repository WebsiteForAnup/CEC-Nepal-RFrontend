-- New map records only. Existing content and policies are untouched.
BEGIN;
CREATE TABLE IF NOT EXISTS public.project_map_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug text NOT NULL CHECK (length(project_slug) BETWEEN 1 AND 150),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 200),
  geojson jsonb NOT NULL CHECK (geojson->>'type' = 'FeatureCollection' AND jsonb_typeof(geojson->'features') = 'array' AND jsonb_array_length(geojson->'features') BETWEEN 1 AND 2000),
  kml_url text NOT NULL CHECK (kml_url LIKE 'https://%'),
  file_name text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  created_by text NOT NULL DEFAULT auth.user_id(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_map_layers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS map_public_read ON public.project_map_layers;
CREATE POLICY map_public_read ON public.project_map_layers FOR SELECT TO anonymous USING (is_published);
DROP POLICY IF EXISTS map_read ON public.project_map_layers;
CREATE POLICY map_read ON public.project_map_layers FOR SELECT TO authenticated USING (is_published OR created_by = auth.user_id());
DROP POLICY IF EXISTS map_create ON public.project_map_layers;
CREATE POLICY map_create ON public.project_map_layers FOR INSERT TO authenticated WITH CHECK (created_by = auth.user_id());
DROP POLICY IF EXISTS map_update ON public.project_map_layers;
CREATE POLICY map_update ON public.project_map_layers FOR UPDATE TO authenticated USING (created_by = auth.user_id()) WITH CHECK (created_by = auth.user_id());
GRANT SELECT, INSERT, UPDATE ON public.project_map_layers TO authenticated;
REVOKE ALL ON public.project_map_layers FROM anonymous;
GRANT SELECT (id, project_slug, name, geojson, kml_url, is_published, created_at) ON public.project_map_layers TO anonymous;
NOTIFY pgrst, 'reload schema';
COMMIT;
