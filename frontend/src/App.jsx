import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import AuthPage from './pages/AuthPage';
import WishlistPage from './pages/WishlistPage';

/**
 * Componente que protege rutas que requieren autenticación.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-register" replace />;
  }

  return children;
}

/**
 * Define todas las rutas visibles de la SPA.
 *
 * @returns {JSX.Element} Conjunto de rutas React Router para la aplicación.
 */
function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/login-register" element={<AuthPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/agregar-producto"
        element={
          <ProtectedRoute>
            <AddProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
