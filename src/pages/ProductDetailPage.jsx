import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { fetchProductoById } from '../services/productosApi';
import '../styles/navbar.css';
import '../styles/product.css';

/**
 * Muestra el detalle de un producto según el `id` de la URL.
 *
 * @returns {JSX.Element} Vista de carga, error o detalle completo.
 */
function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productoId = Number.parseInt(id, 10);

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelado = false;

    // Carga el producto cada vez que cambia el id de la URL.
    (async () => {
      if (Number.isNaN(productoId)) {
        setProducto(null);
        setCargando(false);
        setError(false);
        return;
      }

      setCargando(true);
      setError(false);
      setProducto(null);

      try {
        const p = await fetchProductoById(productoId);
        if (cancelado) return;
        setProducto(p);
      } catch {
        if (!cancelado) setError(true);
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [productoId]);

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
        </main>
      </div>
    );
  }

  return (
    <div className="product-page">
      <TopBar showSearch={false} />
      <div className="container-title">{producto.nombre}</div>
      <main>
        <div className="container-img">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="container-info-product">
          <div className="container-price">
            <span>${producto.precio.toLocaleString()}</span>
          </div>
          <div className="container-description">
            <div className="title-description">
              <h3>Descripción</h3>
            </div>
            <div className="text-description">
              <p>{producto.descripcion}</p>
            </div>
          </div>
          <div className="container-buttons">
            <button type="button" className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>
            <button type="button" className="btn-comprar" onClick={() => navigate('/login-register')}>Comprar</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetailPage;
