import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchInput from './SearchInput';

/**
 * Cabecera superior reutilizable entre páginas.
 *
 * Muestra:
 * - Logo que lleva al inicio
 * - Barra de búsqueda (opcional)
 * - Botón de agregar producto (requiere auth)
 * - Botón de wishlist (requiere auth)
 * - Nombre de usuario + logout cuando autenticado
 * - Botón login/registro cuando no autenticado
 */
function TopBar({
  searchValue = '',
  onSearchChange,
  showSearch = true,
  showAddButton = true,
  showAuthButton = true,
  backToHome = false,
}) {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="top-bar">
      <button type="button" className="logo" onClick={() => navigate('/')}>
        MarketPlace UNAC
      </button>

      {showSearch ? (
        <SearchInput value={searchValue} onChange={onSearchChange} />
      ) : (
        <div style={{ flex: 1 }} />
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {backToHome && (
          <button type="button" className="auth-button" onClick={() => navigate('/')}>
            ← Volver a inicio
          </button>
        )}

        {showAddButton && isAuthenticated && (
          <button
            type="button"
            className="auth-button"
            style={{ backgroundColor: '#28a745' }}
            onClick={() => navigate('/agregar-producto')}
          >
            Agregar Producto
          </button>
        )}

        {showAddButton && !isAuthenticated && (
          <button
            type="button"
            className="auth-button"
            style={{ backgroundColor: '#6c757d' }}
            onClick={() => navigate('/agregar-producto')}
            title="Inicia sesión para agregar productos"
          >
            Agregar Producto
          </button>
        )}

        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="auth-button"
              style={{ backgroundColor: '#e83e8c' }}
              onClick={() => navigate('/wishlist')}
              title="Ver mi lista de deseados"
            >
              ❤️ ({usuario?.wishlist?.length || 0})
            </button>
            <div className="user-info">
              <span className="user-name">{usuario?.nombre?.split(' ')[0]}</span>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                Salir
              </button>
            </div>
          </>
        ) : showAuthButton ? (
          <button type="button" className="auth-button" onClick={() => navigate('/login-register')}>
            Iniciar sesión / Registrarse
          </button>
        ) : null}
      </div>
    </header>
  );
}

export default TopBar;
