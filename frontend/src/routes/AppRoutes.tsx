/**
 * Configuration du routage
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import Dashboard from '@/pages/Dashboard';
import DashboardAnalytics from '@/pages/dashboard/DashboardAnalytics';
import ClientsPage from '@/pages/clients/ClientsPage';
import ProductsPage from '@/pages/products/ProductsPage';
import InvoicesPage from '@/pages/invoices/InvoicesPage';
import ExpensesPage from '@/pages/expenses/ExpensesPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import HelpPage from '@/pages/help/HelpPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import TermsPage from '@/pages/legal/TermsPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';

/**
 * Route protégée
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

/**
 * Routes de l'application
 */
const AppRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Landing page (unauthenticated users) */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Routes protégées */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="analytics" element={<DashboardAnalytics />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
      </Route>

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
