# CEC Nepal V2

Independent React + TypeScript project with server-rendered public pages and
browser hydration. Public pages use a scoped CEC palette and responsive editorial styling.

## Run

From this folder:

- npm ci — install dependencies independently
- npm run dev — development SSR at http://localhost:3001
- npm run typecheck — check TypeScript
- npm run build — build dist/client and dist/server
- npm start — run production SSR at http://localhost:3001
- npm run test:ssr — verify rendering after building

Root shortcuts npm run dev:v2, build:v2, typecheck:v2, and preview:v2 still work.
Restart the old development process after this change: plain vite only serves
the HTML template; node server.mjs supplies the server-rendered content.
Set PORT to change the HTTP port. Development HMR uses PORT + 1.
Deploy using a Node server; this is no longer a static-only deployment.

## Page structure

Public pages: Home, About, CompanyProfile, Services, ServiceDetail, Projects,
ProjectDetail, Team, News, NewsDetail, Gallery, Downloads, Careers, FAQ, Contact,
Privacy, Terms, and NotFound. Existing singular detail URLs are preserved.
Shared semantic components live in src/components/public.

src/services/publicContent.ts reads the local JSON datasets synchronously for
identical server and browser content. Production excludes demo news. These are
local content snapshots, not live Neon results. Existing database/upload services
and admin CRUD pages remain independent copies and use v2/.env as before.

src/entry-server.tsx renders with StaticRouter. src/main.tsx hydrates using
BrowserRouter. server.mjs integrates Vite during development and serves built
client assets plus request-rendered HTML in production. Page titles and 404
status codes are resolved server-side, including missing detail records.

Search/category state lives in URL query parameters; GET forms work before
JavaScript loads. FAQ uses native details elements. No global state atoms are
needed yet. Future user-specific state should be initialized per request, never
stored in a shared mutable server module. Browser/session-dependent auth and
admin code loads only after mounting, inside its own Neon provider. Existing
admin CSS is retained; public styling is scoped under .cec-site. Admin styles can
remain in the browser after client navigation out of admin.

Contact uses the existing Formspree destination with a native POST form. Legal
HTML is trusted checked-in content. No form submissions occur during validation.
.env stays private and Git-ignored. Never serialize credentials into page HTML.

References:
- https://vite.dev/guide/ssr
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://reactrouter.com/api/declarative-routers/StaticRouter

Design references: https://stxgroup.com/strive/ and https://cec-nepal-energy.social60873.chatgpt.site/
Palette tokens live in src/styles/site.css. All five requested HSL values are preserved; navy, warm white, and sage support them.

Public templates now cover every route, including rich news media, project facts
and timelines, team groups, gallery lightbox, resources, careers, FAQs, and legal
documents. Missing download URLs are shown as unpublished rather than linked to #.
The mega navigation groups services by project stage. Project/service links use
the original five portfolio categories; related news uses explicit relatedNewsSlugs.
Navigation and gallery controls use component state. The news ticker can be paused;
scroll color changes and hover motion respect prefers-reduced-motion. SSR content
remains visible before hydration. Public data still comes from local snapshots.

Project geography:
- Leaflet loads only after mounting, preserving SSR. Project portfolio maps follow
  the current filters; project detail maps show that project's linked layers.
- src/data/geography/project-map-links.json maps original feature numbers to
  project slugs. Only verified matches are linked; old polygons are labeled as
  reference geometry. Projects without geometry receive no invented coordinates.
- Contact also includes an interactive map of the existing office coordinates.
- /admin/project-maps validates and previews KML (5 MB / 2,000 placemarks), uploads
  the original to B2, then stores GeoJSON and project_slug via Neon Data API.
  Point, LineString, Polygon (with holes), and MultiGeometry are supported.
  KMZ, external entities, and remote network geometry are not imported.
- Run scripts/project-map-schema.sql once in the Neon Console SQL editor. The
  Data API reads/writes records but cannot create tables. No DATABASE_URL or
  VITE_DATABASE_URL is required. Only published layers are readable anonymously;
  uploaders can unpublish their own layers without deleting the original asset.
- Uses existing VITE_NEON_DATA_API_URL, VITE_NEON_AUTH_URL, and B2 environment
  settings. Public maps read anonymously through Data API; writes use Neon auth.
  Upload failures remain visible and never silently fall back to localStorage.
- npm run test:kml checks geometry conversion and rejects invalid/unsafe input.

Readability and UI maintenance:
- `npm run format` and `npm run format:check` use the checked-in Prettier config
  for the new public pages, components, map services, and KML editor.
- MegaMenuContent contains the menu panels; SiteLayout owns navigation state.
- LeafletMap owns mounting/cleanup; leafletMapHelpers contains basemaps, status
  overlays, bounds, and safe popup creation.
- useProjectMapEditor contains KML selection, validation, upload, and visibility
  actions; ProjectMaps renders the admin form.
- Portfolio maps retain every original geographic record, even without a full
  project profile. Records lacking coordinates remain in the reference list.
  Leaflet provides street/satellite selection and status layer toggles.
- The logo/menu bar stays at the top while scrolling. News ticker controls use
  one accessible pause/play icon; news items contain no decorative icon.
