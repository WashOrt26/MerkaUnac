import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

/**
 * Punto de arranque del frontend React.
 *
 * - `AuthProvider`: mantiene el estado de autenticación global (token, usuario).
 * - `StrictMode`: activa validaciones extra en desarrollo.
 * - `BrowserRouter`: permite rutas tipo `/producto/:id` en el cliente.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
