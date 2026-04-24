/**
 * Tarjeta visual de un producto.
 *
 * @param {{producto: {imagen: string, nombre: string, precio: number}, onClick: () => void}} props Datos y acción al hacer clic.
 * @returns {JSX.Element} Botón/tarjeta del producto.
 */
function ProductCard({ producto, onClick }) {
  return (
    <button type="button" className="card" onClick={onClick}>
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>${producto.precio.toLocaleString()}</h3>
      <p>{producto.nombre}</p>
    </button>
  );
}

export default ProductCard;
