import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import AuthPage from './pages/AuthPage';

/**
 * Define todas las rutas visibles de la SPA.
 *
 * @returns {JSX.Element} Conjunto de rutas React Router para la aplicación.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/agregar-producto" element={<AddProductPage />} />
      <Route path="/login-register" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
