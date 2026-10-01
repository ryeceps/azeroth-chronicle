import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { AppErrorBoundary } from '../components/layout/AppErrorBoundary';
import { BattlePage } from '../pages/BattlePage';
import { EraPage, NotFound } from '../pages/EraPage';
import { EntityPage } from '../pages/EntityPage';
import { EventPage } from '../pages/EventPage';
import { ToursPage } from '../pages/ToursPage';
import { EraTourPage } from '../pages/EraTourPage';
import { LandingPage } from '../pages/LandingPage';
import { StorylineLibraryPage } from '../pages/StorylineLibraryPage';
import { StorylinePage } from '../pages/StorylinePage';

const MapPage = lazy(() => import('../pages/MapPage').then((module) => ({ default: module.MapPage })));
const ArchiveGalleryPage = lazy(() => import('../pages/ArchiveGalleryPage').then((module) => ({ default: module.ArchiveGalleryPage })));

export function App() {
  return (
    <AppShell>
      <AppErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/eras/:slug" element={<EraTourPage />} />
        <Route
          path="/map"
          element={(
            <Suspense fallback={<main className="loading-state" role="status">Opening the atlas…</main>}>
              <MapPage />
            </Suspense>
          )}
        />
        <Route path="/eras/:slug" element={<EraPage />} />
        <Route path="/storylines" element={<StorylineLibraryPage />} />
        <Route path="/storylines/:slug" element={<StorylinePage />} />
        <Route
          path="/archive"
          element={(
            <Suspense fallback={<main className="loading-state" role="status">Opening the illustrated archive…</main>}>
              <ArchiveGalleryPage />
            </Suspense>
          )}
        />
        <Route path="/battles/:slug" element={<BattlePage />} />
        <Route path="/events/:slug" element={<EventPage />} />
        <Route path="/locations/:slug" element={<EntityPage />} />
        <Route path="/factions/:slug" element={<EntityPage />} />
        <Route path="/characters/:slug" element={<EntityPage />} />
        <Route path="/artifacts/:slug" element={<EntityPage />} />
        <Route path="/records/:slug" element={<EntityPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </AppErrorBoundary>
    </AppShell>
  );
}
