import ProductCard from './ProductCard';

/**
 * Renderiza el listado de tarjetas de productos.
 *
 * @param {{productos: Array<{id: number}>, onProductClick: (id: number) => void}} props Lista y callback de selección.
 * @returns {JSX.Element} Grid principal de productos.
 */
function ProductGrid({ productos, onProductClick }) {
  return (
    <main className="products">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} onClick={() => onProductClick(producto.id)} />
      ))}
    </main>
  );
}

export default ProductGrid;
