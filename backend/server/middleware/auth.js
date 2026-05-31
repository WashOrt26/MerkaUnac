/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    MIDDLEWARE DE AUTENTICACIÓN                              ║
 * ║                                                                              ║
 * ║  Este archivo protege las rutas que requieren que el usuario esté logueado. ║
 * ║                                                                              ║
 * ║  CONCEPTOS CLAVE:                                                          ║
 * ║  - Middleware: Función que se ejecuta ANTES de la ruta                     ║
 * ║  - JWT (JSON Web Token): Token que guarda información del usuario            ║
 * ║  - Bearer Token: Formato "Bearer <token>" en el header Authorization       ║
 * ║                                                                              ║
 * ║  FLUJO DE AUTENTICACIÓN:                                                   ║
 * ║  1. Usuario se registra o login → Backend genera JWT                       ║
 * ║  2. Frontend guarda el JWT en localStorage                                  ║
 * ║  3. Frontend envía JWT en header "Authorization: Bearer <token>"          ║
 * ║  4. Middleware verifica que el JWT sea válido                              ║
 * ║  5. Si es válido, continúa a la ruta; si no, devuelve 401                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import jwt from 'jsonwebtoken';

// Clave secreta para firmar y verificar los tokens JWT
// IMPORTANTE: Esta clave debe ser única y difícil de adivinar
// En producción, debería estar en el archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'merkaunac-secret-key-dev';

/**
 * Middleware de autenticación.
 *
 * Este middleware:
 * 1. Lee el header "Authorization" de la petición
 * 2. Extrae el token JWT (formato: "Bearer <token>")
 * 3. Verifica que el token sea válido
 * 4. Si es válido, agrega los datos del usuario a req.user
 * 5. Si no, devuelve error 401
 *
 * CÓMO USARLO:
 * ```javascript
 * // En cualquier ruta, simplemente añade authMiddleware como segundo parámetro:
 * app.get('/ruta-protegida', authMiddleware, (req, res) => {
 *   // Aquí req.user tiene los datos del usuario
 *   console.log(req.user.userId);
 * });
 * ```
 *
 * @param {Object} req - Request de Express (petición del cliente)
 * @param {Object} res - Response de Express (respuesta que enviaremos)
 * @param {Function} next - Función para continuar al siguiente paso
 */
export function authMiddleware(req, res, next) {
  // 1. Obtenemos el header Authorization
  // Formato esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers.authorization;

  // 2. Verificamos que exista y tenga el formato correcto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No hay token → usuario no autenticado
    res.status(401).json({ message: 'No autenticado' });
    return;
  }

  // 3. Extraemos solo el token (quitamos "Bearer ")
  const token = authHeader.slice(7);

  try {
    // 4. Verificamos el token con la clave secreta
    // jwt.verify hace dos cosas:
    // - Comprueba que el token no haya sido manipulado
    // - Comprueba que no haya expirado
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5. Agregamos los datos del usuario a la request
    // Así las rutas siguientes pueden acceder a req.user.userId, etc.
    req.user = decoded;

    // 6. Continuamos a la siguiente función (la ruta)
    next();
  } catch (error) {
    // Token inválido o expirado
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

/**
 * Exportamos la clave JWT para usarla en auth.js
 * (Allí se firma el token cuando un usuario se registra o hace login)
 */
export { JWT_SECRET };
