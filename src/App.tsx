import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import RouteProgressBar from './components/common/RouteProgressBar';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { ReviewsPage } from './pages/public/ReviewsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminPricingPage } from './pages/admin/AdminPricingPage';
import { AdminProcessPage } from './pages/admin/AdminProcessPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminSeoPage } from './pages/admin/AdminSeoPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

// Public layout wrapper with Navbar and Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0F] text-neutral-200 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AuthProvider>
          <RouteProgressBar />
          <ScrollToTop />
          <Routes>
            {/* Public Agency Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/work" element={<ProjectsPage />} />
              <Route path="/work/:slug" element={<ProjectDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/testimonials" element={<ReviewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin CMS Dashboard Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardHome />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route path="reviews" element={<AdminTestimonialsPage />} />
              <Route path="team" element={<AdminTeamPage />} />
              <Route path="pricing" element={<AdminPricingPage />} />
              <Route path="process" element={<AdminProcessPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="seo" element={<AdminSeoPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </SiteProvider>
    </BrowserRouter>
  );
};

export default App;
