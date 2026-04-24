/**
 * MerkaUnac — API REST (Express + Mongoose + MongoDB Atlas).
 *
 * Este archivo hace 4 cosas:
 * 1) Carga configuración desde `.env`.
 * 2) Abre conexión a MongoDB.
 * 3) Define rutas HTTP para productos.
 * 4) Inicia el servidor en el puerto configurado.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Producto from './models/Producto.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const PORT = Number.parseInt(process.env.PORT ?? '4000', 10);
const MONGODB_URI = process.env.MONGODB_URI?.trim();
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME?.trim() || 'MerkaUnac';

if (!MONGODB_URI) {
  console.error('No se encontró MONGODB_URI.');
  console.error(`1) Crea el archivo .env en la raíz del proyecto (ruta esperada: ${envPath}).`);
  console.error('2) Añade: MONGODB_URI=mongodb+srv://usuario:clave@cluster/... (sin comillas).');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/**
 * Devuelve una guía rápida para probar la API desde navegador o Postman.
 *
 * @param {import('express').Request} _req Request HTTP (no usado).
 * @param {import('express').Response} res Response HTTP.
 * @returns {void}
 */
function healthInfo(_req, res) {
  res.json({
    ok: true,
    servicio: 'MerkaUnac API',
    nota: 'La tienda corre con Vite (p. ej. npm run dev → http://localhost:5173).',
    probarApi: {
      listarProductos: 'GET http://localhost:4000/api/productos',
      detalle: 'GET http://localhost:4000/api/productos/:id',
    },
    rutas: [
      'GET /api/productos',
      'GET /api/productos/:id',
      'POST /api/productos',
      'DELETE /api/productos/:id',
    ],
  });
}

/**
 * Calcula el siguiente id numérico de negocio para un nuevo producto.
 *
 * @returns {Promise<number>} Próximo id consecutivo.
 */
async function siguienteIdProducto() {
  const ultimo = await Producto.findOne().sort({ id: -1 }).select('id').lean();
  return (ultimo?.id ?? 0) + 1;
}

/**
 * Lista todos los productos ordenados por id.
 *
 * @param {import('express').Request} _req Request HTTP (sin parámetros en esta ruta).
 * @param {import('express').Response} res Response HTTP.
 * @returns {Promise<void>}
 */
async function listarProductos(_req, res) {
  try {
    const lista = await Producto.find().sort({ id: 1 }).lean();
    const sinMongo = lista.map(({ _id, ...p }) => p);
    res.json(sinMongo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar productos' });
  }
}

/**
 * Busca un producto por el id recibido en la URL.
 *
 * @param {import('express').Request} req Request con `params.id`.
 * @param {import('express').Response} res Response HTTP.
 * @returns {Promise<void>}
 */
async function obtenerProductoPorId(req, res) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Id inválido' });
      return;
    }

    const doc = await Producto.findOne({ id }).lean();
    if (!doc) {
      res.status(404).json({ message: 'No encontrado' });
      return;
    }

    const { _id, ...producto } = doc;
    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar el producto' });
  }
}

/**
 * Crea un producto nuevo tomando los datos del body JSON.
 *
 * @param {import('express').Request} req Request con `body` del producto.
 * @param {import('express').Response} res Response HTTP.
 * @returns {Promise<void>}
 */
async function crearProducto(req, res) {
  try {
    const { nombre, precio, descripcion, imagen, categoria } = req.body ?? {};
    if (!nombre || precio === undefined || !descripcion || !imagen || !categoria) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    const precioNum = Number(precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      res.status(400).json({ message: 'Precio inválido' });
      return;
    }

    const id = await siguienteIdProducto();
    const creado = await Producto.create({
      id,
      nombre: String(nombre).trim(),
      precio: precioNum,
      descripcion: String(descripcion).trim(),
      imagen: String(imagen).trim(),
      categoria: String(categoria).trim(),
    });

    const obj = creado.toObject();
    delete obj._id;
    res.status(201).json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
}

/**
 * Elimina un producto por id numérico.
 *
 * @param {import('express').Request} req Request con `params.id`.
 * @param {import('express').Response} res Response HTTP.
 * @returns {Promise<void>}
 */
async function eliminarProducto(req, res) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Id inválido' });
      return;
    }

    const borrado = await Producto.findOneAndDelete({ id });
    if (!borrado) {
      res.status(404).json({ message: 'No encontrado' });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar' });
  }
}

app.get('/', healthInfo);
app.get('/api/productos', listarProductos);
app.get('/api/productos/:id', obtenerProductoPorId);
app.post('/api/productos', crearProducto);
app.delete('/api/productos/:id', eliminarProducto);

await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
console.log('Conectado a MongoDB Atlas');
console.log(`Base de datos: ${mongoose.connection.db.databaseName}`);

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}  (interfaz: npm run dev → http://localhost:5173)`);
});
