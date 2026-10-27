import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './features/auth/AuthContext';
import { ScrollToTop } from './components/Common/ScrollToTop';
import { LandingPage } from './features/landing/LandingPage';
import { AuthPage } from './features/auth/AuthPage';
import { Shell } from './components/Layout/Shell';
import { ProjectsPage } from './features/projects/ProjectsPage';
import { ProjectDetailPage } from './features/projects/ProjectDetailPage';
import { PortfolioPage } from './features/portfolio/PortfolioPage';
import { SecondaryMarketPage } from './features/secondary-market/SecondaryMarketPage';
import { AdminReviewPage } from './features/admin/AdminReviewPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Landing & Onboarding */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Authenticated Application */}
            <Route path="/app" element={<Shell />}>
              <Route index element={<Navigate to="/app/projects" replace />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="secondary-market" element={<SecondaryMarketPage />} />
              <Route path="admin-review" element={<AdminReviewPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};
