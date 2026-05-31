import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addToWishlist, removeFromWishlist, checkWishlist } from '../services/wishlistApi';

/**
 * Tarjeta visual de un producto con botón de wishlist.
 *
 * @param {{producto: {imagen: string, nombre: string, precio: number, _id: string}, onClick: () => void}} props Datos y acción al hacer clic.
 * @returns {JSX.Element} Tarjeta del producto con corazón.
 */
function ProductCard({ producto, onClick }) {
  const { token, isAuthenticated, usuario, actualizarUsuario } = useAuth();
  const [enWishlist, setEnWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Verificar si el producto está en wishlist al montar
  useEffect(() => {
    if (!isAuthenticated || !token || !producto._id) return;

    let cancelado = false;

    (async () => {
      try {
        const { enWishlist: estado } = await checkWishlist(token, producto._id);
        if (!cancelado) setEnWishlist(estado);
      } catch {
        // Silencioso: no mostrar error por un checkbox de wishlist
      }
    })();

    return () => { cancelado = true; };
  }, [isAuthenticated, token, producto._id]);

  /**
   * Alterna el estado de wishlist del producto.
   */
  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated || !token) {
      // Redirigir a login
      window.location.href = '/login-register';
      return;
    }

    setLoadingWishlist(true);

    try {
      if (enWishlist) {
        await removeFromWishlist(token, producto._id);
        setEnWishlist(false);
        // Actualizar contador en contexto
        if (usuario) {
          actualizarUsuario({ wishlist: usuario.wishlist.filter(id => id !== producto._id) });
        }
      } else {
        await addToWishlist(token, producto._id);
        setEnWishlist(true);
        // Actualizar contador en contexto
        if (usuario) {
          actualizarUsuario({ wishlist: [...(usuario.wishlist || []), producto._id] });
        }
      }
    } catch {
      // Error silencioso para no interrumpir la UX
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <button type="button" className="card" onClick={onClick}>
      <div className="card-image-container">
        <img src={producto.imagen} alt={producto.nombre} />
        {isAuthenticated && (
          <button
            type="button"
            className={`wishlist-heart ${enWishlist ? 'active' : ''}`}
            onClick={toggleWishlist}
            disabled={loadingWishlist}
            aria-label={enWishlist ? 'Quitar de wishlist' : 'Agregar a wishlist'}
          >
            {enWishlist ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <h3>${producto.precio.toLocaleString()}</h3>
      <p className="card-title">{producto.nombre}</p>
    </button>
  );
}

export default ProductCard;
