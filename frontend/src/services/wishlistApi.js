/**
 * Cliente HTTP del frontend hacia los endpoints de wishlist de MerkaUnac.
 *
 * Todas las funciones requieren token JWT del usuario autenticado.
 */

const BASE = '/api/wishlist';

/**
 * Extrae el mensaje de error de la respuesta HTTP.
 *
 * @param {Response} res Respuesta fallida.
 * @returns {Promise<string>} Mensaje de error.
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
 * Headers con autenticación.
 *
 * @param {string} token JWT del usuario.
 * @returns {HeadersInit} Headers para fetch.
 */
function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Obtiene la wishlist del usuario autenticado.
 *
 * @param {string} token JWT del usuario.
 * @returns {Promise<Array<{_id: string, nombre: string, precio: number, imagen: string, categoria: string}>>} Lista de productos.
 * @throws {Error} Cuando la API falla.
 */
export async function fetchWishlist(token) {
  const res = await fetch(BASE, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Agrega un producto a la wishlist.
 *
 * @param {string} token JWT del usuario.
 * @param {string} productoId ObjectId del producto.
 * @returns {Promise<{message: string, wishlistCount: number}>} Confirmación.
 * @throws {Error} Cuando la API falla.
 */
export async function addToWishlist(token, productoId) {
  const res = await fetch(`${BASE}/${productoId}`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Elimina un producto de la wishlist.
 *
 * @param {string} token JWT del usuario.
 * @param {string} productoId ObjectId del producto.
 * @returns {Promise<{message: string, wishlistCount: number}>} Confirmación.
 * @throws {Error} Cuando la API falla.
 */
export async function removeFromWishlist(token, productoId) {
  const res = await fetch(`${BASE}/${productoId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Verifica si un producto está en la wishlist.
 *
 * @param {string} token JWT del usuario.
 * @param {string} productoId ObjectId del producto.
 * @returns {Promise<{enWishlist: boolean}>} Estado del producto.
 * @throws {Error} Cuando la API falla.
 */
export async function checkWishlist(token, productoId) {
  const res = await fetch(`${BASE}/check/${productoId}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
