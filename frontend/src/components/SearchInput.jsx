/**
 * Campo de búsqueda controlado por el componente padre.
 *
 * @param {{value: string, onChange?: (value: string) => void}} props Props del input.
 * @returns {JSX.Element} Input HTML para buscar productos.
 */
function SearchInput({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Buscar productos..."
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

export default SearchInput;
