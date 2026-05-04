/**
 * Cliente HTTP del frontend hacia la API MerkaUnac.
 *
 * Las URLs son relativas (`/api/...`) para que Vite las proxifique al backend en desarrollo.
 */
const base = '/api';

/**
 * Intenta extraer el mensaje de error real enviado por el backend.
 *
 * @param {Response} res Respuesta HTTP fallida.
 * @returns {Promise<string>} Mensaje listo para mostrar al usuario.
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
 * Trae todos los productos desde la API.
 *
 * @returns {Promise<Array<object>>} Lista de productos.
 * @throws {Error} Cuando la API responde con error.
 */
export async function fetchProductos() {
  const res = await fetch(`${base}/productos`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Crea un producto nuevo en la base de datos.
 *
 * @param {{nombre: string, precio: number, descripcion: string, imagen: string, categoria: string}} payload Datos del producto.
 * @returns {Promise<object>} Producto creado por el backend.
 * @throws {Error} Cuando la API rechaza los datos.
 */
export async function createProducto(payload) {
  const res = await fetch(`${base}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Elimina un producto por su id numérico.
 *
 * @param {number} id Id del producto que se quiere borrar.
 * @returns {Promise<void>} Promesa resuelta cuando se elimina correctamente.
 * @throws {Error} Cuando no existe o ocurre otro fallo HTTP.
 */
export async function deleteProducto(id) {
  const res = await fetch(`${base}/productos/${id}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Producto no encontrado');
  if (!res.ok) throw new Error(await parseError(res));
}

/**
 * Busca un producto por id.
 *
 * @param {number} id Id del producto solicitado.
 * @returns {Promise<object|null>} Producto encontrado o `null` si el backend responde 404.
 * @throws {Error} Cuando ocurre un error distinto a "no encontrado".
 */
export async function fetchProductoById(id) {
  const res = await fetch(`${base}/productos/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
