/**
 * Utilidades de dominio compartidas por la UI (sin llamadas a red).
 */

/** Categorías disponibles para filtrar y crear productos. */
export const CATEGORIAS = [
  'Electrónica',
  'Vehículos',
  'Hogar',
  'Ropa',
  'Juegos',
  'Servicios',
  'Accesorios',
  'Estudio',
  'Comida',
];

/**
 * Filtra una lista de productos por categoría y por texto de búsqueda.
 *
 * @param {Array<{categoria: string, nombre: string}>} productos Lista base de productos.
 * @param {string|null} categoria Categoría seleccionada; `null` significa "todas".
 * @param {string} busqueda Texto escrito por el usuario en el buscador.
 * @returns {Array<{categoria: string, nombre: string}>} Nueva lista ya filtrada.
 */
export function filterProductos(productos, categoria, busqueda) {
  return productos
    .filter((p) => !categoria || p.categoria === categoria)
    .filter((p) => !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
}
