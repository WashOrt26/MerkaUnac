/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                         MERKAUNAC - API REST                                 ║
 * ║                                                                              ║
 * ║  Plataforma de comercio comunitario para la UNAC.                            ║
 * ║  Este archivo es el SERVIDOR BACKEND que:                                    ║
 * ║                                                                              ║
 * ║  1. Se conecta a MongoDB (base de datos en la nube)                         ║
 * ║  2. Define las rutas HTTP (endpoints de la API)                              ║
 * ║  3. Maneja las peticiones de los usuarios                                    ║
 * ║                                                                              ║
 * ║  NOTA: Este archivo usa ECMAScript Modules (ESM) por eso usa "import"        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// IMPORTS (Importaciones)
// ============================================================================
// Los imports traen código de otros archivos/bibliotecas que necesitamos usar.

// Importaciones de Node.js (vienen con Node, no necesitan npm install)
import path from 'node:path';           // Para trabajar con rutas de archivos
import { fileURLToPath } from 'node:url'; // Para obtener __dirname en ESM

// Bibliotecas instaladas con npm
import dotenv from 'dotenv';           // Lee variables de entorno desde .env
import express from 'express';          // Framework web (maneja HTTP)
import cors from 'cors';               // Permite conexiones desde el frontend
import mongoose from 'mongoose';        // ORM para MongoDB (facilita la BD)

// Archivos nuestros del proyecto
import authRouter from './routes/auth.js';      // Rutas de autenticación
import Producto from './models/Producto.js';    // Modelo de productos
import Usuario from './models/Usuario.js';      // Modelo de usuarios
import { authMiddleware } from './middleware/auth.js'; // Verifica tokens JWT

// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================

// Obtenemos la ruta del directorio actual (requerido en ESM)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Leemos las variables de entorno desde el archivo .env
// Esto nos permite tener configuración separada del código
dotenv.config({ path: envPath });

// Puerto donde correra el servidor (default: 4000 si no está configurado)
const PORT = Number.parseInt(process.env.PORT ?? '4000', 10);

// URI de MongoDB - la dirección de nuestra base de datos en la nube
// IMPORTANTE: Esta dirección está en el archivo .env, NO aquí
const MONGODB_URI = process.env.MONGODB_URI?.trim();
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME?.trim() || 'MerkaUnac';

// Si no hay URI de MongoDB, el servidor no puede funcionar - terminamos con error
if (!MONGODB_URI) {
  console.error('❌ No se encontró MONGODB_URI en el archivo .env');
  console.error(`   Ruta esperada: ${envPath}`);
  console.error('   Solución: Crea el archivo backend/.env con MONGODB_URI=...');
  process.exit(1);
}

// ============================================================================
// CONFIGURACIÓN DE EXPRESS
// ============================================================================

// Creamos la aplicación Express
const app = express();

// CORS permite que el frontend (en otro puerto) se comunique con esta API
// origin: true significa que aceptamos peticiones desde cualquier origen
app.use(cors({ origin: true }));

// express.json() permite que Express entienda datos JSON en las peticiones
// Sin esto, no podríamos leer req.body como objeto JavaScript
app.use(express.json());

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================
// Estas funciones ayudan a formatear los datos antes de enviarlos al frontend

/**
 * Normaliza el campo de imágenes para productos nuevos y antiguos.
 *
 * PROBLEMA QUE RESUELVE:
 * - Productos nuevos tienen: imagenes: ["url1", "url2"] (array)
 * - Productos antiguos tienen: imagen: "url" (string único)
 *
 * Esta función hace que ambos formatos funcionen, siempre devolviendo un array.
 *
 * @param {Object} producto - El producto de la base de datos
 * @returns {string[]} Array de URLs de imágenes
 */
function normalizarImagenes(producto) {
  // Si ya tiene imagenes (array) y no está vacío, lo usamos
  if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
    return producto.imagenes;
  }
  // Si tiene imagen única (formato antiguo), la envolvemos en array
  if (producto.imagen) {
    return [producto.imagen];
  }
  // Si no tiene ninguna, devolvemos array vacío
  return [];
}

/**
 * Formatea un producto para la respuesta JSON de la API.
 *
 * IMPORTANTE: MongoDB devuelve objetos con _id (ObjectId de Mongo)
 * pero el frontend espera _id como string. Esta función hace la conversión.
 *
 * @param {Object} p - Producto de la base de datos (ya con .lean())
 * @returns {Object} Producto formateado para JSON
 */
function formatearProducto(p) {
  const imagenes = normalizarImagenes(p);

  return {
    // _id de MongoDB → string para el frontend
    _id: p._id.toString(),

    // Datos del producto
    nombre: p.nombre,
    precio: p.precio,
    descripcion: p.descripcion,

    // Imágenes (siempre array)
    imagenes: imagenes,
    imagen: imagenes[0] || '', // Primera imagen para compatibilidad

    // Categoría
    categoria: p.categoria,

    // Información del vendedor (viene de la relación populate)
    vendedor: {
      _id: p.vendedor?._id?.toString() || '',
      nombre: p.vendedor?.nombre || 'Desconocido',
      telefono: p.vendedor?.telefono || '',
    },

    // Estado del producto (disponible/vendido)
    estado: p.estado,

    // Fecha de creación
    createdAt: p.createdAt,
  };
}

/**
 * Normaliza imágenes para productos en la wishlist.
 *
 * Similar a normalizarImagenes pero maneja el caso donde
 * los productos en la wishlist pueden estar vacíos.
 *
 * @param {Object} p - Producto de la wishlist
 * @returns {string} Primera imagen o string vacío
 */
function formatearWishlistProducto(p) {
  const imagenes = normalizarImagenes(p);

  return {
    _id: p._id.toString(),
    nombre: p.nombre || 'Sin nombre',
    precio: p.precio || 0,
    imagen: imagenes[0] || '',
    imagenes: imagenes,
    categoria: p.categoria || 'Sin categoría',
    vendedor: p.vendedor ? p.vendedor.toString() : '',
  };
}

// ============================================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================================
// Las rutas de auth están en un archivo separado para mantener el código organizado

app.use('/api/auth', authRouter);

// ============================================================================
// RUTAS DE PRODUCTOS
// ============================================================================
// Estas rutas manejan el catálogo de productos

/**
 * GET /api/productos
 * Lista todos los productos del catálogo.
 *
 * ACCESO: Público (no requiere login)
 * USO: Página principal del catálogo
 *
 * Devuelve: Array de productos formateados
 */
app.get('/api/productos', async (_req, res) => {
  try {
    // Buscamos todos los productos, más recientes primero (sort: -1 en createdAt)
    // .populate('vendedor') nos trae los datos del vendedor, no solo su ID
    const lista = await Producto.find()
      .sort({ createdAt: -1 })
      .populate('vendedor', 'nombre telefono')
      .lean();

    // Formateamos cada producto para el frontend
    res.json(lista.map(formatearProducto));
  } catch (err) {
    console.error('Error al listar productos:', err);
    res.status(500).json({ message: 'Error al listar productos' });
  }
});

/**
 * GET /api/productos/mios
 * Lista SOLO los productos del usuario autenticado.
 *
 * ACCESO: Privado (requiere login)
 * USO: Página "Agregar Producto" para ver productos propios
 *
 * IMPORTANTE: Esta ruta filtra productos por el ID del usuario logueado.
 */
app.get('/api/productos/mios', authMiddleware, async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    const lista = await Producto.find({ vendedor: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('vendedor', 'nombre telefono')
      .lean();

    res.json(lista.map(formatearProducto));
  } catch (err) {
    console.error('Error al listar productos del usuario:', err);
    res.status(500).json({ message: 'Error al listar productos' });
  }
});

/**
 * GET /api/productos/:id
 * Obtiene el detalle de un producto específico.
 *
 * ACCESO: Público
 * USO: Página de detalle del producto
 *
 * :id es un parámetro de URL - viene de la ruta /producto/:id del frontend
 */
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validamos que el ID sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Buscamos el producto por su ObjectId
    // .populate('vendedor', 'nombre correo telefono') trae los datos del vendedor
    const producto = await Producto.findById(id)
      .populate('vendedor', 'nombre correo telefono')
      .lean();

    if (!producto) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    res.json(formatearProducto(producto));
  } catch (err) {
    console.error('Error al buscar producto:', err);
    res.status(500).json({ message: 'Error al buscar el producto' });
  }
});

/**
 * POST /api/productos
 * Crea un nuevo producto.
 *
 * ACCESO: Privado (requiere login)
 * BODY: { nombre, precio, descripcion, imagenes[], categoria }
 *
 * El vendedor se toma automáticamente del token JWT (req.user.userId)
 */
app.post('/api/productos', authMiddleware, async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagenes, categoria } = req.body ?? {};

    // Validación de campos obligatorios
    if (!nombre || precio === undefined || !descripcion || !imagenes || !categoria) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    // Validación de precio
    const precioNum = Number(precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      res.status(400).json({ message: 'Precio inválido' });
      return;
    }

    // Normalizar imagenes a array
    const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];
    if (imagenesArray.length === 0 || imagenesArray.some(img => !img || typeof img !== 'string')) {
      res.status(400).json({ message: 'Debe proporcionar al menos una imagen válida' });
      return;
    }

    // Creamos el producto con el vendedor del token JWT
    const producto = await Producto.create({
      nombre: String(nombre).trim(),
      precio: precioNum,
      descripcion: String(descripcion).trim(),
      imagenes: imagenesArray.map(img => String(img).trim()),
      categoria: String(categoria).trim(),
      vendedor: req.user.userId, // ID del usuario logueado
    });

    // Obtenemos el producto recién creado con datos del vendedor
    const populated = await Producto.findById(producto._id)
      .populate('vendedor', 'nombre telefono')
      .lean();

    res.status(201).json(formatearProducto(populated));
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
});

/**
 * DELETE /api/productos/:id
 * Elimina un producto.
 *
 * ACCESO: Privado (solo el dueño puede eliminar)
 * RESTRICCIÓN: Solo el usuario que creó el producto puede eliminarlo
 */
app.delete('/api/productos/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const producto = await Producto.findById(id);

    if (!producto) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    // VERIFICACIÓN DE PROPIETARIO:
    // Comparamos el ID del vendedor del producto con el ID del usuario logueado
    if (producto.vendedor.toString() !== req.user.userId) {
      res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
      return;
    }

    await Producto.findByIdAndDelete(id);
    res.status(204).send(); // 204 = Eliminado exitosamente, sin contenido
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ message: 'Error al eliminar' });
  }
});

// ============================================================================
// RUTAS DE WISHLIST (LISTA DE DESEADOS)
// ============================================================================
// La wishlist permite a usuarios autenticados guardar productos favoritos

/**
 * GET /api/wishlist
 * Obtiene la lista de productos favoritos del usuario.
 *
 * ACCESO: Privado
 *
 * La wishlist está guardada en el documento del usuario en MongoDB.
 * Usamos .populate() para traer los datos reales de los productos.
 */
app.get('/api/wishlist', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.userId)
      .populate('wishlist', 'nombre precio imagenes imagen categoria')
      .lean();

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Si no hay wishlist o está vacía, devolver array vacío
    if (!usuario.wishlist || !Array.isArray(usuario.wishlist)) {
      res.json([]);
      return;
    }

    const wishlist = usuario.wishlist.map(formatearWishlistProducto);
    res.json(wishlist);
  } catch (err) {
    console.error('Error al obtener wishlist:', err);
    res.status(500).json({ message: 'Error al obtener wishlist' });
  }
});

/**
 * POST /api/wishlist/:productoId
 * Agrega un producto a la wishlist.
 *
 * ACCESO: Privado
 *
 * No permite duplicados - si el producto ya está, no hace nada.
 */
app.post('/api/wishlist/:productoId', authMiddleware, async (req, res) => {
  try {
    const { productoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      res.status(400).json({ message: 'ID de producto inválido' });
      return;
    }

    // Verificamos que el producto exista
    const producto = await Producto.findById(productoId);
    if (!producto) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    // Buscamos el usuario
    const usuario = await Usuario.findById(req.user.userId);
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Evitar duplicados: solo agregamos si no existe
    const objectIdProducto = new mongoose.Types.ObjectId(productoId);
    if (!usuario.wishlist.includes(objectIdProducto)) {
      usuario.wishlist.push(objectIdProducto);
      await usuario.save();
    }

    res.json({
      message: 'Producto agregado a wishlist',
      wishlistCount: usuario.wishlist.length
    });
  } catch (err) {
    console.error('Error al agregar a wishlist:', err);
    res.status(500).json({ message: 'Error al agregar a wishlist' });
  }
});

/**
 * DELETE /api/wishlist/:productoId
 * Elimina un producto de la wishlist.
 *
 * ACCESO: Privado
 */
app.delete('/api/wishlist/:productoId', authMiddleware, async (req, res) => {
  try {
    const { productoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      res.status(400).json({ message: 'ID de producto inválido' });
      return;
    }

    const usuario = await Usuario.findById(req.user.userId);
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Filter: mantenemos todos los productos EXCEPTO el que queremos eliminar
    usuario.wishlist = usuario.wishlist.filter(
      id => id.toString() !== productoId
    );
    await usuario.save();

    res.json({
      message: 'Producto eliminado de wishlist',
      wishlistCount: usuario.wishlist.length
    });
  } catch (err) {
    console.error('Error al eliminar de wishlist:', err);
    res.status(500).json({ message: 'Error al eliminar de wishlist' });
  }
});

/**
 * GET /api/wishlist/check/:productoId
 * Verifica si un producto está en la wishlist del usuario.
 *
 * ACCESO: Privado
 * USO: Para mostrar el estado del corazón (❤️ o 🤍) en las tarjetas
 */
app.get('/api/wishlist/check/:productoId', authMiddleware, async (req, res) => {
  try {
    const { productoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      res.status(400).json({ message: 'ID de producto inválido' });
      return;
    }

    const usuario = await Usuario.findById(req.user.userId).lean();
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Verificamos si el producto está en el array de wishlist
    const enWishlist = usuario.wishlist.some(
      id => id.toString() === productoId
    );

    res.json({ enWishlist });
  } catch (err) {
    console.error('Error al verificar wishlist:', err);
    res.status(500).json({ message: 'Error al verificar wishlist' });
  }
});

// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================

// Nos conectamos a MongoDB y luego arrancamos el servidor Express
await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });

console.log('✅ Conectado a MongoDB Atlas');
console.log(`   Base de datos: ${mongoose.connection.db.databaseName}`);

app.listen(PORT, () => {
  console.log(`\n🚀 API corriendo en http://localhost:${PORT}`);
  console.log(`   Frontend: http://localhost:5173 (o el puerto de Vite)`);
  console.log(`\n📡 Endpoints disponibles:`);
  console.log(`   GET    /api/productos           - Ver todos los productos`);
  console.log(`   GET    /api/productos/:id      - Ver detalle de producto`);
  console.log(`   POST   /api/auth/register       - Registrarse`);
  console.log(`   POST   /api/auth/login          - Iniciar sesión`);
  console.log(`   GET    /api/wishlist            - Ver mis favoritos (requiere auth)`);
});
