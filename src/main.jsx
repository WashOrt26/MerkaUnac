import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

/**
 * Punto de arranque del frontend React.
 *
 * - `StrictMode`: activa validaciones extra en desarrollo.
 * - `BrowserRouter`: permite rutas tipo `/producto/:id` en el cliente.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
