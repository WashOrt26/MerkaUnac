import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useAuth } from '../contexts/AuthContext';
import { fetchWishlist, removeFromWishlist } from '../services/wishlistApi';
import '../styles/navbar.css';
import '../styles/wishlist.css';

/**
 * Página que muestra los productos en la wishlist del usuario autenticado.
 */
function WishlistPage() {
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Carga la wishlist desde la API.
   */
  const cargarWishlist = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const lista = await fetchWishlist(token);
      setProductos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error('Error al cargar wishlist:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar wishlist');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      cargarWishlist();
    }
  }, [token, authLoading]);

  /**
   * Elimina un producto de la wishlist y actualiza la UI.
   */
  const handleRemove = async (productoId) => {
    try {
      await removeFromWishlist(token, productoId);
      setProductos(prev => prev.filter(p => p._id !== productoId));
    } catch (err) {
      console.error('Error al eliminar de wishlist:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  // Mostrar loading si está cargando auth o wishlist
  if (authLoading || loading) {
    return (
      <div className="wishlist-page">
        <TopBar showSearch={false} showAddButton showAuthButton={false} backToHome />
        <main className="wishlist-container">
          <p className="wishlist-loading">Cargando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <TopBar showSearch={false} showAddButton showAuthButton={false} backToHome />

      <main className="wishlist-container">
        <h1 className="wishlist-title">WishList</h1>

        {error ? (
          <p className="wishlist-error">{error}</p>
        ) : productos.length === 0 ? (
          <div className="wishlist-empty">
            <p>No tienes productos en tu wishlist todavía.</p>
            <p>Explora el catálogo y guarda tus favoritos </p>
            <button type="button" onClick={() => navigate('/')} className="wishlist-explore-btn">
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {productos.map((producto) => (
              <div key={producto._id} className="wishlist-card">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  onClick={() => navigate(`/producto/${producto._id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="wishlist-card-info">
                  <h3>{producto.nombre}</h3>
                  <p className="wishlist-price">${producto.precio.toLocaleString()}</p>
                  <p className="wishlist-categoria">{producto.categoria}</p>
                </div>
                <div className="wishlist-card-actions">
                  <button
                    type="button"
                    className="btn-ver"
                    onClick={() => navigate(`/producto/${producto._id}`)}
                  >
                    Ver producto
                  </button>
                  <button
                    type="button"
                    className="btn-quitar"
                    onClick={() => handleRemove(producto._id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default WishlistPage;
