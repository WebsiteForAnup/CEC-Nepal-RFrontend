import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { SignedIn } from '@neondatabase/neon-js/auth/react';
import { authClient } from './lib/auth';
import useScrollToTop from './hooks/useScrollToTop';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import '@neondatabase/neon-js/ui/css';
const Auth = lazy(() => import('./pages/Auth'));
const Account = lazy(() => import('./pages/Account'));
const SharedAdmin = lazy(() => import('./components/SharedAdmin'));
const ListNews = lazy(() => import('./pages/admin/ListNews'));
const CreateNews = lazy(() => import('./pages/admin/CreateNews'));
const ListEvents = lazy(() => import('./pages/admin/ListEvents'));
const CreateEvent = lazy(() => import('./pages/admin/CreateEvent'));
const ListTeam = lazy(() => import('./pages/admin/ListTeam'));
const CreateTeam = lazy(() => import('./pages/admin/CreateTeam'));
const ListSliders = lazy(() => import('./pages/admin/ListSliders'));
const CreateSlider = lazy(() => import('./pages/admin/CreateSlider'));
const ListServices = lazy(() => import('./pages/admin/ListServices'));
const CreateService = lazy(() => import('./pages/admin/CreateService'));
const GalleryAdmin = lazy(() => import('./pages/admin/GalleryAdmin'));
const CreateGallery = lazy(() => import('./pages/admin/CreateGallery'));
const ProjectMaps = lazy(() => import('./pages/admin/ProjectMaps'));

function AdminContent() {
  useScrollToTop();
  return (
    <>
      <header className="v2-header">
        <Link to="/">CEC Nepal</Link>
        <nav aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/auth/sign-in">Sign in</Link>
        </nav>
      </header>
      <SignedIn>
        <nav className="v2-admin-nav" aria-label="Admin navigation">
          <Link to="/account">My account</Link>
          {['news', 'events', 'team', 'sliders', 'services', 'gallery', 'project-maps'].map(
            (section) => (
              <Link key={section} to={'/admin/' + section}>
                {section}
              </Link>
            ),
          )}
          <button type="button" onClick={() => authClient.signOut()}>
            Sign out
          </button>
        </nav>
      </SignedIn>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <Routes>
          <Route path="/auth/:pathname" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route element={<SharedAdmin />}>
            <Route path="/admin/project-maps" element={<ProjectMaps />} />
            <Route path="/admin/news" element={<ListNews />} />
            <Route path="/admin/news/create" element={<CreateNews />} />
            <Route path="/admin/news/edit/:id" element={<CreateNews />} />
            <Route path="/admin/events" element={<ListEvents />} />
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="/admin/events/edit/:id" element={<CreateEvent />} />
            <Route path="/admin/team" element={<ListTeam />} />
            <Route path="/admin/team/create" element={<CreateTeam />} />
            <Route path="/admin/team/edit/:id" element={<CreateTeam />} />
            <Route path="/admin/sliders" element={<ListSliders />} />
            <Route path="/admin/sliders/create" element={<CreateSlider />} />
            <Route path="/admin/sliders/edit/:id" element={<CreateSlider />} />
            <Route path="/admin/services" element={<ListServices />} />
            <Route path="/admin/services/create" element={<CreateService />} />
            <Route path="/admin/services/edit/:id" element={<CreateService />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
            <Route path="/admin/gallery/create" element={<CreateGallery />} />
            <Route path="/admin/gallery/edit/:id" element={<CreateGallery />} />
          </Route>
          <Route
            path="*"
            element={
              <main className="v2-home">
                <h1>Page not found</h1>
                <Link to="/">Return home</Link>
              </main>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default function AdminApp() {
  return (
    <NeonAuthUIProvider emailOTP authClient={authClient}>
      <AdminContent />
    </NeonAuthUIProvider>
  );
}
