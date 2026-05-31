/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    RUTAS DE AUTENTICACIÓN                                 ║
 * ║                                                                              ║
 * ║  Este archivo contiene todas las rutas relacionadas con usuarios:           ║
 * ║  - Registro (crear cuenta nueva)                                           ║
 * ║  - Login (iniciar sesión)                                                 ║
 * ║  - Ver perfil (datos del usuario actual)                                 ║
 * ║  - Logout (cerrar sesión)                                                 ║
 * ║  - Actualizar perfil                                                       ║
 * ║                                                                              ║
 * ║  CONCEPTOS CLAVE:                                                          ║
 * ║  - bcrypt: Librería para hashear contraseñas de forma segura              ║
 * ║  - JWT: Token que identifica al usuario                                   ║
 * ║  - Salt: Datos aleatorios que hacen el hash único                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { authMiddleware, JWT_SECRET } from '../middleware/auth.js';

// Creamos un router para agrupar las rutas de auth
const router = Router();

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Valida que el correo sea institucional (@unac.edu.co).
 *
 * Esta es una restricción del proyecto MerkaUnac:
 * solo miembros de la comunidad UNAC pueden registrarse.
 *
 * @param {string} correo - Email a validar
 * @returns {boolean} true si termina en @unac.edu.co
 */
function esCorreoInstitucional(correo) {
  return correo.endsWith('@unac.edu.co');
}

/**
 * Normaliza la imagen de un producto para la wishlist.
 *
 * @param {Object} producto - Producto de la base de datos
 * @returns {string} URL de la primera imagen o string vacío
 */
function normalizarWishlistImagenes(producto) {
  // Si tiene array de imágenes, tomar la primera
  if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
    return producto.imagenes[0];
  }
  // Si tiene imagen única (formato antiguo)
  if (producto.imagen) {
    return producto.imagen;
  }
  // Si no tiene nada
  return '';
}

// ============================================================================
// RUTAS PÚBLICAS (no requieren autenticación)
// ============================================================================

/**
 * POST /api/auth/register
 * Registra un nuevo usuario en la plataforma.
 *
 * BODY (datos que envía el frontend):
 * {
 *   nombre: string,      // Nombre completo
 *   correo: string,       // Email institucional (debe ser @unac.edu.co)
 *   password: string,    // Contraseña (mínimo 6 caracteres)
 *   telefono: string     // Teléfono de contacto (opcional)
 * }
 *
 * RESPUESTA (lo que devuelve el backend):
 * {
 *   token: string,        // JWT para autenticación
 *   usuario: {            // Datos públicos del usuario
 *     id: string,
 *     nombre: string,
 *     correo: string,
 *     telefono: string
 *   }
 * }
 *
 * ERRORES POSIBLES:
 * - 400: Faltan campos, contraseña muy corta, correo no institucional
 * - 409: El correo ya está registrado
 * - 500: Error interno del servidor
 */
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, password, telefono } = req.body ?? {};

    // ─────────────────────────────────────────────────────────────
    // VALIDACIONES
    // ─────────────────────────────────────────────────────────────

    // 1. Campos obligatorios
    if (!nombre || !correo || !password) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    // 2. Longitud de contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // 3. Validar correo institucional
    const correoLower = correo.toLowerCase().trim();
    if (!esCorreoInstitucional(correoLower)) {
      res.status(400).json({
        message: 'Solo se permiten correos institucionales (@unac.edu.co)'
      });
      return;
    }

    // 4. Verificar que el correo no esté registrado
    const existe = await Usuario.findOne({ correo: correoLower }).lean();
    if (existe) {
      res.status(409).json({ message: 'El correo ya está registrado' });
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // CREACIÓN DEL USUARIO
    // ─────────────────────────────────────────────────────────────

    // Hashear la contraseña con bcrypt:
    // - bcrypt.genSalt(10) genera un "salt" aleatorio
    // - bcrypt.hash(password, salt) hashea la contraseña
    // El salt hace que cada hash sea único aunque las contraseñas sean iguales
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear el usuario en la base de datos
    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      correo: correoLower,
      passwordHash, // ← Contraseña hasheada, NUNCA la original
      telefono: telefono?.trim() || '',
    });

    // ─────────────────────────────────────────────────────────────
    // GENERAR TOKEN JWT
    // ─────────────────────────────────────────────────────────────

    // El JWT contiene información del usuario codificada
    // Payload (lo que guardamos en el token):
    // {
    //   userId: ID del usuario en MongoDB,
    //   nombre: Nombre para mostrar,
    //   correo: Email para referencia
    // }
    // El token expira en 7 días (después debe login de nuevo)
    const token = jwt.sign(
      { userId: usuario._id.toString(), nombre: usuario.nombre, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: '7d' } // 7 días de validez
    );

    // Devolvemos el token y los datos públicos del usuario
    res.status(201).json({
      token,
      usuario: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono || '',
      },
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

/**
 * POST /api/auth/login
 * Inicia sesión con credenciales existentes.
 *
 * BODY:
 * {
 *   correo: string,    // Email institucional
 *   password: string  // Contraseña
 * }
 *
 * RESPUESTA:
 * {
 *   token: string,
 *   usuario: { id, nombre, correo, telefono }
 * }
 *
 * ERRORES:
 * - 400: Faltan credenciales
 * - 401: Credenciales incorrectas (usuario no existe o contraseña mala)
 * - 500: Error interno
 */
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body ?? {};

    // Validar que existan las credenciales
    if (!correo || !password) {
      res.status(400).json({ message: 'Faltan credenciales' });
      return;
    }

    // Buscar usuario por correo
    // .lean() convierte el documento Mongoose a objeto JavaScript simple
    const usuario = await Usuario.findOne({
      correo: correo.toLowerCase().trim()
    }).lean();

    // Si no existe el usuario
    if (!usuario) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
      return;
    }

    // Comparar contraseña:
    // bcrypt.compare hace el proceso inverso del hash
    // Toma la contraseña que envió el usuario, la hashea,
    // y compara con el hash que tenemos guardado
    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordValido) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
      return;
    }

    // Generar token JWT (mismo proceso que en registro)
    const token = jwt.sign(
      { userId: usuario._id.toString(), nombre: usuario.nombre, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Devolver token y datos del usuario
    res.json({
      token,
      usuario: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono || '',
      },
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// ============================================================================
// RUTAS PRIVADAS (requieren autenticación)
// ============================================================================

/**
 * GET /api/auth/me
 * Obtiene los datos del usuario autenticado actual.
 *
 * IMPORTANTE: Esta ruta usa authMiddleware como protección.
 * El frontend debe enviar el token en el header:
 * Authorization: Bearer <token>
 *
 * RESPUESTA:
 * {
 *   id: string,
 *   nombre: string,
 *   correo: string,
 *   telefono: string,
 *   wishlist: [{ _id, nombre, precio, imagen, categoria }, ...]
 * }
 *
 * .populate('wishlist') convierte los ObjectIds de la wishlist
 * en los documentos completos de los productos.
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    // Contiene: { userId, nombre, correo }
    const usuario = await Usuario.findById(req.user.userId)
      .select('-passwordHash') // Excluir la contraseña del resultado
      .populate('wishlist', 'nombre precio imagenes imagen categoria')
      .lean();

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Formatear wishlist: normalizar imágenes de cada producto
    const wishlistFormateada = usuario.wishlist.map(p => ({
      _id: p._id.toString(),
      nombre: p.nombre,
      precio: p.precio,
      imagen: normalizarWishlistImagenes(p),
      categoria: p.categoria,
    }));

    res.json({
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono || '',
      wishlist: wishlistFormateada,
    });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario.
 *
 * NOTA: Con JWT sin estado, esto solo confirma que el cliente
 * puede borrar su token. No hay invalidación real del token.
 * El cliente debe eliminar el token del localStorage.
 *
 * El token seguirá siendo válido hasta que expire (7 días).
 */
router.post('/logout', authMiddleware, (_req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
});

/**
 * PUT /api/auth/perfil
 * Actualiza el perfil del usuario (teléfono).
 *
 * BODY:
 * {
 *   telefono: string  // Nuevo número de teléfono
 * }
 *
 * RESPUESTA:
 * {
 *   message: string,
 *   telefono: string
 * }
 */
router.put('/perfil', authMiddleware, async (req, res) => {
  try {
    const { telefono } = req.body ?? {};

    // Buscar y actualizar en una sola operación
    const usuario = await Usuario.findByIdAndUpdate(
      req.user.userId,
      { telefono: telefono?.trim() || '' },
      { new: true } // Devolver el documento actualizado
    ).lean();

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({
      message: 'Perfil actualizado',
      telefono: usuario.telefono || '',
    });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

// Exportamos el router para usarlo en index.js
export default router;
