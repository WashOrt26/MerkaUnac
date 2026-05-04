/**
 * Renderiza botones para filtrar por categoría.
 *
 * @param {{categorias: string[], categoriaSeleccionada: string|null, onSelect: (categoria: string|null) => void}} props Props del filtro.
 * @returns {JSX.Element} Botonera de categorías.
 */
function CategoryFilter({ categorias, categoriaSeleccionada, onSelect }) {
  return (
    <section className="categories">
      {categorias.map((categoria) => (
        <button
          key={categoria}
          type="button"
          className={categoriaSeleccionada === categoria ? 'active' : ''}
          onClick={() => onSelect(categoriaSeleccionada === categoria ? null : categoria)}
        >
          {categoria}
        </button>
      ))}
    </section>
  );
}

export default CategoryFilter;
