import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { HomePage } from '../pages/home/HomePage';
import { PropertiesPage } from '../pages/properties/PropertiesPage';
import { PropertyDetailsPage } from '../pages/property-details/PropertyDetailsPage';
import { AboutPage } from '../pages/about/AboutPage';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { FavoritesPage } from '../pages/dashboard/FavoritesPage';
import { SavedSearchesPage } from '../pages/dashboard/SavedSearchesPage';
import { ListingsPage } from '../pages/dashboard/ListingsPage';
import { MessagesPage } from '../pages/dashboard/MessagesPage';
import { NotificationsPage } from '../pages/dashboard/NotificationsPage';
import { ReviewsPage } from '../pages/dashboard/ReviewsPage';
import { ProfilePage } from '../pages/dashboard/ProfilePage';
import { InquiriesPage } from '../pages/inquiries/InquiriesPage';
import { InquiryDetailsPage } from '../pages/inquiries/InquiryDetailsPage';
import { DashboardInquiriesPage } from '../pages/dashboard/inquiries/DashboardInquiriesPage';

import { SellPage } from '../pages/sell/SellPage';
import { EditListingPage } from '../pages/sell/EditListingPage';

import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPropertiesPage } from '../pages/admin/AdminPropertiesPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public / Marketplace routes with RootLayout */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route path="/inquiries" element={<InquiriesPage />} />
        <Route path="/inquiries/:id" element={<InquiryDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/sell/edit/:id" element={<EditListingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Authentication routes with AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* User Dashboard routes with DashboardLayout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="saved-searches" element={<SavedSearchesPage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="inquiries" element={<DashboardInquiriesPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="properties" element={<AdminPropertiesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>
    </Routes>
  );
};

export { ProtectedRoute } from './ProtectedRoute';

