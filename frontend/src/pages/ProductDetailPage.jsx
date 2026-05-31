import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ImageSlider from '../components/ImageSlider';
import { useAuth } from '../contexts/AuthContext';
import { fetchProductoById } from '../services/productosApi';
import { addToWishlist, removeFromWishlist, checkWishlist } from '../services/wishlistApi';
import '../styles/navbar.css';
import '../styles/product.css';

/**
 * Muestra el detalle de un producto según el `id` de la URL.
 *
 * Incluye:
 * - Slider de imágenes
 * - Botón de compra (redirige a login si no autenticado)
 * - Info del vendedor SOLO al presionar "Contactar vendedor"
 * - Botón de wishlist
 */
function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, isAuthenticated, usuario, actualizarUsuario } = useAuth();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [enWishlist, setEnWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [mostrarContacto, setMostrarContacto] = useState(false);

  // Cargar producto
  useEffect(() => {
    let cancelado = false;

    (async () => {
      if (!id) {
        setProducto(null);
        setCargando(false);
        setError(false);
        return;
      }

      setCargando(true);
      setError(false);
      setProducto(null);
      setMostrarContacto(false);

      try {
        const p = await fetchProductoById(id);
        if (cancelado) return;
        setProducto(p);
      } catch {
        if (!cancelado) setError(true);
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => { cancelado = true; };
  }, [id]);

  // Verificar estado de wishlist cuando cambia el producto o auth
  useEffect(() => {
    if (!isAuthenticated || !token || !producto?._id) return;

    let cancelado = false;

    (async () => {
      try {
        const { enWishlist: estado } = await checkWishlist(token, producto._id);
        if (!cancelado) setEnWishlist(estado);
      } catch {
        // Silencioso
      }
    })();

    return () => { cancelado = true; };
  }, [isAuthenticated, token, producto?._id]);

  /**
   * Maneja el clic en "Contactar":
   * - Si no autenticado: redirige a login
   * - Si autenticado: muestra la info del vendedor
   */
  const handleContactar = () => {
    if (!isAuthenticated) {
      navigate('/login-register', { state: { from: `/producto/${id}` } });
    } else {
      setMostrarContacto(true);
    }
  };

  /**
   * Toggle wishlist del producto actual.
   */
  const toggleWishlist = async () => {
    if (!isAuthenticated || !token || !producto?._id) {
      navigate('/login-register');
      return;
    }

    setLoadingWishlist(true);
    try {
      if (enWishlist) {
        await removeFromWishlist(token, producto._id);
        setEnWishlist(false);
        if (usuario) {
          actualizarUsuario({ wishlist: usuario.wishlist.filter(pid => pid !== producto._id) });
        }
      } else {
        await addToWishlist(token, producto._id);
        setEnWishlist(true);
        if (usuario) {
          actualizarUsuario({ wishlist: [...(usuario.wishlist || []), producto._id] });
        }
      }
    } catch {
      // Silencioso
    } finally {
      setLoadingWishlist(false);
    }
  };

  if (cargando) {
    return (
      <div className="product-page">
        <TopBar showSearch={false} />
        <main style={{ display: 'block', textAlign: 'center', padding: '2rem' }}>
          <p>Cargando producto…</p>
        </main>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="product-page">
        <TopBar showSearch={false} />
        <main style={{ display: 'block', textAlign: 'center' }}>
          <p>
            {error
              ? 'No se pudo cargar el producto. Revisa que el servidor API esté en ejecución.'
              : 'Producto no encontrado.'}
          </p>
          <button type="button" className="btn-volver" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </main>
      </div>
    );
  }

  const imagenes = producto.imagenes || (producto.imagen ? [producto.imagen] : []);
  const vendedor = producto.vendedor || {};

  return (
    <div className="product-page">
      <TopBar showSearch={false} />
      <div className="container-title">{producto.nombre}</div>
      <main>
        <div className="container-img">
          <ImageSlider imagenes={imagenes} alt={producto.nombre} />
        </div>

        <div className="container-info-product">
          <div className="container-price">
            <span>${producto.precio.toLocaleString()}</span>
            {isAuthenticated && (
              <button
                type="button"
                onClick={toggleWishlist}
                disabled={loadingWishlist}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '4px',
                }}
                title={enWishlist ? 'Quitar de wishlist' : 'Agregar a wishlist'}
              >
                {enWishlist ? '❤️' : '🤍'}
              </button>
            )}
          </div>

          <div className="container-description">
            <div className="title-description">
              <h3>Descripción</h3>
            </div>
            <div className="text-description">
              <p>{producto.descripcion}</p>
            </div>
          </div>

          {/* Info del vendedor - SOLO visible después de hacer clic en Contactar */}
          {mostrarContacto && vendedor.nombre && (
            <div className="vendedor-info">
              <h4>📞 Información de Contacto del Vendedor</h4>
              <div className="vendedor-dato">
                <span>👤</span>
                <strong>{vendedor.nombre}</strong>
              </div>
              {vendedor.correo && (
                <div className="vendedor-dato">
                  <span>📧</span>
                  <a href={`mailto:${vendedor.correo}`}>{vendedor.correo}</a>
                </div>
              )}
              {vendedor.telefono ? (
                <div className="vendedor-dato">
                  <span>📱</span>
                  <a href={`https://wa.me/${vendedor.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    {vendedor.telefono}
                  </a>
                </div>
              ) : (
                <p style={{ marginTop: '10px', fontSize: '13px', color: '#64748B' }}>
                  El vendedor no ha proporcionado número de teléfono
                </p>
              )}
            </div>
          )}

          <div className="container-buttons">
            <button type="button" className="btn-volver" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            <button
              type="button"
              className="btn-comprar"
              onClick={handleContactar}
            >
              {isAuthenticated
                ? mostrarContacto
                  ? 'Información mostrada'
                  : ' Contactar vendedor'
                : ' Iniciar sesión para comprar'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetailPage;
