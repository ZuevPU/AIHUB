import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { PageLoader } from '@/components/PageLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useIsEmbedded } from '@/hooks/useIsEmbedded';

const CatalogPage = lazy(() => import('@/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const MaterialDetailPage = lazy(() =>
  import('@/pages/MaterialDetailPage').then((m) => ({ default: m.MaterialDetailPage }))
);
const PromptBuilderPage = lazy(() =>
  import('@/pages/PromptBuilderPage').then((m) => ({ default: m.PromptBuilderPage }))
);
const PromptBuilderVideoPage = lazy(() =>
  import('@/pages/PromptBuilderVideoPage').then((m) => ({ default: m.PromptBuilderVideoPage }))
);
const PromptBuilderPresentationPage = lazy(() =>
  import('@/pages/PromptBuilderPresentationPage').then((m) => ({ default: m.PromptBuilderPresentationPage }))
);
const PromptBuilderAnalyticsPage = lazy(() =>
  import('@/pages/PromptBuilderAnalyticsPage').then((m) => ({ default: m.PromptBuilderAnalyticsPage }))
);
const PromptBuilderEditorPage = lazy(() =>
  import('@/pages/PromptBuilderEditorPage').then((m) => ({ default: m.PromptBuilderEditorPage }))
);
const DeveloperSinglePagePage = lazy(() =>
  import('@/pages/DeveloperSinglePagePage').then((m) => ({ default: m.DeveloperSinglePagePage }))
);

function Layout() {
  const { pathname, search } = useLocation();
  const isEmbedded = useIsEmbedded();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-950">
      {!isEmbedded && <Header />}
      <main className="flex-1">
        <Outlet context={{ isEmbedded }} />
      </main>
      {!isEmbedded && <Footer />}
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="catalog"
              element={
                <LazyPage>
                  <CatalogPage />
                </LazyPage>
              }
            />
            <Route
              path="designer/prompt-builder"
              element={
                <LazyPage>
                  <PromptBuilderPage />
                </LazyPage>
              }
            />
            <Route
              path="designer/video-prompt-builder"
              element={
                <LazyPage>
                  <PromptBuilderVideoPage />
                </LazyPage>
              }
            />
            <Route
              path="designer/presentation-prompt-builder"
              element={
                <LazyPage>
                  <PromptBuilderPresentationPage />
                </LazyPage>
              }
            />
            <Route
              path="manager/analytics-prompt-builder"
              element={
                <LazyPage>
                  <PromptBuilderAnalyticsPage />
                </LazyPage>
              }
            />
            <Route
              path="editor/prompt-builder"
              element={
                <LazyPage>
                  <PromptBuilderEditorPage />
                </LazyPage>
              }
            />
            <Route
              path="developer/single-page-apps"
              element={
                <LazyPage>
                  <DeveloperSinglePagePage />
                </LazyPage>
              }
            />
            <Route
              path="material/:id"
              element={
                <LazyPage>
                  <MaterialDetailPage />
                </LazyPage>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
