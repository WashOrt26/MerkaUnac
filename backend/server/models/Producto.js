import mongoose from 'mongoose';

/**
 * Esquema de la colección `productos` en MongoDB.
 *
 * - `id` (number): identificador de negocio expuesto en la API y en las rutas React (`/producto/:id`).
 *   Es único y distinto del `_id` que Mongo genera por defecto.
 * - Las respuestas JSON del servidor omiten `_id` para mantener el contrato simple con el front.
 */
const productoSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, required: true },
    categoria: { type: String, required: true },
  },
  { versionKey: false, collection: 'productos' },
);

export default mongoose.model('Producto', productoSchema);
