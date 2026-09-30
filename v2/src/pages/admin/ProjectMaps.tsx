import useProjectMapEditor from '../../hooks/useProjectMapEditor';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import { Link } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';
import LeafletMap from '../../components/public/LeafletMap';
import '../../styles/project-maps-admin.css';
function Editor() {
  const {
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
  } = useProjectMapEditor();
  return (
    <main className="cec-map-admin">
      <h1>Project maps & KML</h1>
      <p>Choose a project, validate its KML, and review the geometry before publishing.</p>
      {error && (
        <p role="alert" className="map-error">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      <form onSubmit={publish}>
        <fieldset disabled={busy}>
          <label>
            Project
            <select value={project} onChange={(event) => setProject(event.target.value)}>
              {publicContent.projects.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            KML file (maximum 5 MB)
            <input
              ref={input}
              type="file"
              accept=".kml,application/vnd.google-earth.kml+xml"
              onChange={(event) => void chooseKmlFile(event.target.files?.[0])}
            />
          </label>
          {geojson && (
            <>
              <label>
                Layer name
                <input
                  required
                  maxLength={200}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <p>{geojson.features.length} geographic features ready for review.</p>
              {warnings.map((warning, index) => (
                <p key={index}>{warning}</p>
              ))}
              <LeafletMap layers={layers} />
            </>
          )}
          <button disabled={!file || !geojson || !name.trim()} type="submit">
            {busy ? 'Uploading… ' + progress + '%' : 'Publish KML layer'}
          </button>
        </fieldset>
      </form>
      <h2>Uploaded layers</h2>
      <p>
        Unpublishing hides a layer from public maps while retaining its original file. Only the
        uploader can change its visibility.
      </p>
      {rows.length === 0 && <p>No uploaded layers yet.</p>}
      {rows.map((row) => (
        <article key={row.id}>
          <div>
            <h3>{row.name}</h3>
            <Link to={'/project/' + row.project_slug}>
              {publicContent.projects.find((project) => project.slug === row.project_slug)?.name ||
                row.project_slug}
            </Link>
            <p>
              {row.is_published ? 'Published' : 'Unpublished'} ·{' '}
              {new Date(row.created_at).toLocaleDateString()}
            </p>
            <a href={row.kml_url} target="_blank" rel="noreferrer">
              Original KML ↗
            </a>
          </div>
          <button disabled={busy} onClick={() => void toggleLayerVisibility(row)}>
            {row.is_published ? 'Unpublish' : 'Publish'}
          </button>
        </article>
      ))}
    </main>
  );
}
export default function ProjectMaps() {
  return (
    <>
      <SignedIn>
        <Editor />
      </SignedIn>
      <SignedOut>
        <main className="cec-map-admin">
          <h1>Project maps</h1>
          <Link to="/auth/sign-in">Sign in to upload KML</Link>
        </main>
      </SignedOut>
    </>
  );
}
