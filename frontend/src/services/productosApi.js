/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    SERVICIO DE PRODUCTOS                                    ║
 * ║                                                                              ║
 * ║  Este archivo contiene funciones para manejar productos:                   ║
 * ║  - Obtener todos los productos (catálogo)                                 ║
 * ║  - Obtener un producto específico (detalle)                                ║
 * ║  - Crear un nuevo producto                                                 ║
 * ║  - Eliminar un producto                                                    ║
 * ║  - Obtener productos propios del usuario                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

const base = '/api';

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONES DE UTILIDAD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extrae el mensaje de error de una respuesta HTTP fallida.
 * @param {Response} res - Respuesta de fetch
 * @returns {Promise<string>} Mensaje de error
 */
async function parseError(res) {
  try {
    const body = await res.json();
    return body.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

/**
 * Crea headers con autenticación opcional.
 * @param {string|null} token - JWT opcional
 * @returns {Object} Headers para fetch
 */
function headers(token = null) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONES DE PRODUCTOS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los productos del catálogo (público).
 *
 * @returns {Promise<Array>} Lista de productos
 * @throws {Error} Cuando la API falla
 *
 * NOTA: Esta ruta es pública, no requiere token.
 */
export async function fetchProductos() {
  const res = await fetch(`${base}/productos`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Obtiene los productos DEL USUARIO LOGUEADO (para "Agregar Producto").
 *
 * A diferencia de fetchProductos(), esta ruta solo devuelve
 * los productos que el usuario actual ha publicado.
 *
 * @param {string} token - JWT del usuario (requerido)
 * @returns {Promise<Array>} Lista de productos del usuario
 * @throws {Error} Cuando la API falla o no hay token
 */
export async function fetchMisProductos(token) {
  const res = await fetch(`${base}/productos/mios`, {
    headers: headers(token)
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Obtiene el detalle de un producto específico.
 *
 * @param {string} id - ObjectId del producto (de la URL)
 * @returns {Promise<Object|null>} Producto o null si no existe
 * @throws {Error} Cuando ocurre un error diferente a "no encontrado"
 */
export async function fetchProductoById(id) {
  const res = await fetch(`${base}/productos/${id}`);
  if (res.status === 404) return null;  // Producto no existe
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Crea un nuevo producto.
 *
 * El vendedor se asigna automáticamente desde el token JWT.
 *
 * @param {Object} payload - Datos del producto
 * @param {string} payload.nombre - Título del producto
 * @param {number} payload.precio - Precio
 * @param {string} payload.descripcion - Descripción
 * @param {string[]} payload.imagenes - Array de URLs de imágenes
 * @param {string} payload.categoria - Categoría
 * @param {string} token - JWT del usuario (requerido)
 * @returns {Promise<Object>} Producto creado
 * @throws {Error} Cuando la API rechaza los datos
 */
export async function createProducto(payload, token) {
  const res = await fetch(`${base}/productos`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Elimina un producto.
 *
 * SOLO el usuario que lo creó puede eliminarlo (verificación en backend).
 *
 * @param {string} id - ObjectId del producto
 * @param {string} token - JWT del usuario
 * @returns {Promise<void>}
 * @throws {Error} Cuando no existe o no tienes permisos
 */
export async function deleteProducto(id, token) {
  const res = await fetch(`${base}/productos/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (res.status === 404) throw new Error('Producto no encontrado');
  if (!res.ok) throw new Error(await parseError(res));
}
