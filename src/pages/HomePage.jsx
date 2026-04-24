import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { fetchProductos } from '../services/productosApi';
import { CATEGORIAS, filterProductos } from '../utils/products';
import '../styles/navbar.css';
import '../styles/home.css';

/**
 * Página principal: carga productos desde la API y aplica filtros en memoria.
 *
 * @returns {JSX.Element} Pantalla Home con barra superior, filtros y grid.
 */
function HomePage() {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    let cancelado = false;

    // Carga inicial de catálogo al montar la pantalla.
    (async () => {
      try {
        const lista = await fetchProductos();
        if (!cancelado) {
          setProductos(lista);
          setErrorCarga(null);
        }
      } catch (e) {
        if (!cancelado) {
          setErrorCarga(e instanceof Error ? e.message : 'No se pudo conectar con el servidor');
        }
      }
    })();

    return () => {
      // Evita `setState` cuando el componente ya no está montado.
      cancelado = true;
    };
  }, []);

  const productosFiltrados = filterProductos(productos, categoriaSeleccionada, busqueda);

  return (
    <div className="home-page">
      <TopBar searchValue={busqueda} onSearchChange={setBusqueda} />
      {errorCarga ? (
        <p className="home-api-error" role="alert">
          {errorCarga}. Asegúrate de tener el archivo .env con MONGODB_URI y ejecutar{' '}
          <code>npm run server</code> o <code>npm run dev:full</code>.
        </p>
      ) : null}
      <CategoryFilter
        categorias={CATEGORIAS}
        categoriaSeleccionada={categoriaSeleccionada}
        onSelect={setCategoriaSeleccionada}
      />
      <ProductGrid productos={productosFiltrados} onProductClick={(id) => navigate(`/producto/${id}`)} />
    </div>
  );
}

export default HomePage;
