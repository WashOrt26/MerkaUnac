import { useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';

/**
 * Cabecera superior reutilizable entre páginas.
 *
 * @param {{searchValue?: string, onSearchChange?: (value: string) => void, showSearch?: boolean, showAddButton?: boolean, showAuthButton?: boolean, backToHome?: boolean}} props Configuración visual y callbacks.
 * @returns {JSX.Element} Barra superior con acciones de navegación.
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

  return (
    <header className="top-bar">
      <button type="button" className="logo" onClick={() => navigate('/')}>Marketplace</button>
      {showSearch ? <SearchInput value={searchValue} onChange={onSearchChange} /> : <div style={{ flex: 1 }} />}
      <div style={{ display: 'flex', gap: '10px' }}>
        {showAddButton && (
          <button type="button" className="auth-button" style={{ backgroundColor: '#28a745' }} onClick={() => navigate('/agregar-producto')}>
            Agregar Producto
          </button>
        )}
        {backToHome && (
          <button type="button" className="auth-button" onClick={() => navigate('/')}>
            ← Volver a inicio
          </button>
        )}
        {showAuthButton && (
          <button type="button" className="auth-button" onClick={() => navigate('/login-register')}>
            Iniciar sesión / Registrarse
          </button>
        )}
      </div>
    </header>
  );
}

export default TopBar;
