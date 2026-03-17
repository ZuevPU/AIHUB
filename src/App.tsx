import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { MaterialDetailPage } from '@/pages/MaterialDetailPage';
import { PromptBuilderPage } from '@/pages/PromptBuilderPage';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-950">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="designer/prompt-builder" element={<PromptBuilderPage />} />
          <Route path="material/:id" element={<MaterialDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
