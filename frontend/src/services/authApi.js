/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    SERVICIO DE AUTENTICACIÓN                             ║
 * ║                                                                              ║
 * ║  Este archivo contiene funciones para comunicarse con la API de auth.     ║
 * ║                                                                              ║
 * ║  CONCEPTOS CLAVE:                                                          ║
 * ║  - fetch: Función del navegador para hacer peticiones HTTP              ║
 * ║  - Promise: Representa un valor que estará disponible "en el futuro"  ║
 * ║  - async/await: Forma de escribir código asíncrono más legible      ║
 * ║                                                                              ║
 * ║  ¿QUÉ ES fetch()?                                                         ║
 * ║  fetch('url') hace una petición HTTP al servidor y devuelve una        ║
 * ║  Promise que se resuelve cuando llega la respuesta.                      ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

// URL base de la API - las peticiones van a /api/auth/*
const BASE = '/api/auth';

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Extrae el mensaje de error de una respuesta HTTP fallida.
 *
 * El backend envía errores en formato JSON:
 * { "message": "Descripción del error" }
 *
 * Esta función intenta leer ese mensaje para mostrarlo al usuario.
 *
 * @param {Response} res - Objeto Response de fetch
 * @returns {Promise<string>} Mensaje de error o texto del status
 */
async function parseError(res) {
  try {
    const body = await res.json();
    return body.message ?? res.statusText;
  } catch {
    // Si no se puede leer como JSON, devolvemos el texto del status
    return res.statusText;
  }
}

/**
 * Crea los headers para peticiones HTTP.
 *
 * Incluye el token JWT si se proporciona.
 *
 * @param {string|null} token - JWT opcional para autenticación
 * @returns {Object} Headers para fetch
 */
function headers(token = null) {
  const h = { 'Content-Type': 'application/json' };
  if (token) {
    // Formato: "Bearer <token>"
    h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

// ============================================================================
// VALIDACIONES
// ============================================================================

/**
 * Valida que un correo sea institucional (@unac.edu.co).
 *
 * Esta validación se hace tanto aquí (frontend) como en el backend
 * por seguridad. El frontend para dar feedback rápido,
 * el backend para verificación real.
 *
 * @param {string} correo - Email a validar
 * @returns {Object} { valido: boolean, mensaje: string }
 *
 * @example
 * validarCorreoInstitucional('usuario@unac.edu.co')
 * // → { valido: true, mensaje: '' }
 *
 * validarCorreoInstitucional('usuario@gmail.com')
 * // → { valido: false, mensaje: 'Solo correos @unac.edu.co' }
 */
export function validarCorreoInstitucional(correo) {
  // Verificar que sea string y no esté vacío
  if (!correo || typeof correo !== 'string') {
    return { valido: false, mensaje: 'Correo requerido' };
  }

  // Limpiar espacios y convertir a minúsculas
  const trimmed = correo.trim().toLowerCase();

  // Verificar que termine en @unac.edu.co
  if (!trimmed.endsWith('@unac.edu.co')) {
    return {
      valido: false,
      mensaje: 'Solo se permiten correos institucionales (@unac.edu.co)'
    };
  }

  return { valido: true, mensaje: '' };
}

// ============================================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================================

/**
 * Registra un nuevo usuario en la plataforma.
 *
 * @param {Object} datos - Datos del formulario de registro
 * @param {string} datos.nombre - Nombre completo
 * @param {string} datos.correo - Email institucional
 * @param {string} datos.password - Contraseña
 * @param {string} [datos.telefono] - Teléfono opcional
 *
 * @returns {Promise<Object>} Respuesta del servidor
 * @returns {string} .token - JWT de autenticación
 * @returns {Object} .usuario - Datos públicos del usuario
 *
 * @throws {Error} Cuando la API rechaza el registro
 *
 * @example
 * try {
 *   const { token, usuario } = await register({
 *     nombre: 'Juan Pérez',
 *     correo: 'juan@unac.edu.co',
 *     password: 'micontraseña123',
 *     telefono: '3001234567'
 *   });
 *   console.log('Registrado:', usuario.nombre);
 * } catch (e) {
 *   console.error('Error:', e.message);
 * }
 */
export async function register({ nombre, correo, password, telefono }) {
  // ─────────────────────────────────────────────────────────────
  // VALIDACIÓN FRONTEND (feedback rápido al usuario)
  // ─────────────────────────────────────────────────────────────
  const correoValidado = validarCorreoInstitucional(correo);
  if (!correoValidado.valido) {
    throw new Error(correoValidado.mensaje);
  }

  // ─────────────────────────────────────────────────────────────
  // PETICIÓN AL SERVIDOR
  // ─────────────────────────────────────────────────────────────
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',                                        // Método HTTP
    headers: headers(),                                   // Content-Type: application/json
    body: JSON.stringify({                                // Convertir objeto a JSON
      nombre,
      correo: correo.trim().toLowerCase(),
      password,
      telefono: telefono?.trim() || ''                   // Enviar vacío si no hay
    }),
  });

  // Si el servidor respondió con error (4xx, 5xx)
  if (!res.ok) throw new Error(await parseError(res));

  // Devolver datos de la respuesta
  return res.json();
}

/**
 * Inicia sesión con credenciales existentes.
 *
 * @param {Object} credenciales - Credenciales de login
 * @param {string} credenciales.correo - Email institucional
 * @param {string} credenciales.password - Contraseña
 *
 * @returns {Promise<Object>} Respuesta del servidor
 * @returns {string} .token - JWT de autenticación
 * @returns {Object} .usuario - Datos públicos del usuario
 *
 * @throws {Error} Cuando las credenciales son incorrectas
 */
export async function login({ correo, password }) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      correo: correo.trim().toLowerCase(),
      password
    }),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Obtiene los datos del usuario actual usando el token.
 *
 * Se usa al iniciar la app para verificar que el token guardado
 * todavía es válido.
 *
 * @param {string} token - JWT del usuario
 *
 * @returns {Promise<Object>} Datos completos del usuario
 * @returns {string} .id - ID del usuario
 * @returns {string} .nombre - Nombre completo
 * @returns {string} .correo - Email
 * @returns {string} .telefono - Teléfono
 * @returns {Array} .wishlist - Lista de productos favoritos
 *
 * @throws {Error} Cuando el token es inválido o expirado
 */
export async function fetchCurrentUser(token) {
  // GET no tiene body, solo headers
  const res = await fetch(`${BASE}/me`, {
    headers: headers(token)  // Incluye el token en Authorization
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Cierra la sesión del usuario.
 *
 * NOTA: Con JWT sin estado, esto solo confirma al servidor.
 * El frontend debe borrar el token de localStorage después.
 *
 * @param {string} token - JWT del usuario
 * @returns {Promise<void>}
 * @throws {Error} Cuando la API falla
 */
export async function logout(token) {
  const res = await fetch(`${BASE}/logout`, {
    method: 'POST',
    headers: headers(token),
  });

  if (!res.ok) throw new Error(await parseError(res));
}

/**
 * Actualiza el teléfono del usuario en su perfil.
 *
 * @param {string} telefono - Nuevo número de teléfono
 * @param {string} token - JWT del usuario
 *
 * @returns {Promise<Object>} Respuesta del servidor
 * @returns {string} .message - Mensaje de confirmación
 * @returns {string} .telefono - Teléfono actualizado
 *
 * @throws {Error} Cuando la API falla
 */
export async function actualizarTelefono(telefono, token) {
  const res = await fetch(`${BASE}/perfil`, {
    method: 'PUT',                                        // PUT para actualizar
    headers: headers(token),
    body: JSON.stringify({ telefono }),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
