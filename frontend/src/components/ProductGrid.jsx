import ProductCard from './ProductCard';

/**
 * Renderiza el listado de tarjetas de productos.
 *
 * @param {{productos: Array<{_id: string}>, onProductClick: (id: string) => void}} props Lista y callback de selección.
 * @returns {JSX.Element} Grid principal de productos.
 */
function ProductGrid({ productos, onProductClick }) {
  return (
    <main className="products">
      {productos.map((producto) => (
        <ProductCard key={producto._id} producto={producto} onClick={() => onProductClick(producto._id)} />
      ))}
    </main>
  );
}

export default ProductGrid;
