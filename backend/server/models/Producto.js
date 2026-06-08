/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                           MODELO DE PRODUCTO                                  ║
 * ║                                                                              ║
 * ║  Este archivo define cómo se guardan los productos en MongoDB.             ║
 * ║                                                                              ║
 * ║  CONCEPTOS CLAVE:                                                          ║
 * ║  - imagenes[]: Array de strings para múltiples imágenes                     ║
 * ║  - vendedor: Referencia al usuario que creó el producto                     ║
 * ║  - ObjectId: Identificador único de MongoDB                                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import mongoose from 'mongoose';

/**
 * Esquema del producto.
 *
 * CADA CAMPO EXPLICADO:
 *
 * - nombre: Título del producto
 *
 * - precio: Número (puede tener decimales para pesos, etc.)
 *
 * - descripcion: Texto largo con detalles del producto
 *
 * - imagenes: Array de URLs de imágenes.
 *   * type: [String] significa que es un array de strings
 *   * validate: Requiere al menos una imagen
 *   * Cada elemento del array es una URL de imagen
 *
 * - categoria: Clasificación del producto
 *
 * - vendedor: Referencia al usuario que publicó el producto.
 *   * ref: 'Usuario' → El ObjectId apunta a un documento de la colección 'usuarios'
 *   * required: true → Todo producto debe tener un vendedor
 *
 * - estado: Si está disponible o vendido.
 *   * enum: Solo permite estos valores específicos
 *   * default: Si no se especifica, es 'disponible'
 */
const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },

    precio: {
      type: Number,
      required: true,
      min: 0  // No puede ser negativo
    },

    descripcion: {
      type: String,
      required: true,
      trim: true
    },

    // Array de URLs de imágenes (soporta múltiples imágenes por producto)
    imagenes: {
      type: [String],
      required: true,
      // Validación personalizada: debe tener al menos una imagen
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Debe tener al menos una imagen'
      }
    },

    categoria: {
      type: String,
      required: true
    },

    // Referencia al usuario que publicó el producto
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },

    // Estado del producto: disponible o vendido
    estado: {
      type: String,
      enum: ['disponible', 'vendido'],  // Solo estos valores
      default: 'disponible'
    }
  },
  {
    versionKey: false,    // No crear campo __v
    collection: 'productos', // Colección 'productos' en MongoDB
    timestamps: true       // Crea createdAt y updatedAt automáticamente
  }
);

/**
 * ÍNDICES DE MONGODB
 *
 * Los índices aceleran las búsquedas en la base de datos.
 * Son como el índice de un libro: buscan más rápido.
 */

// Índice en categoría → acelera búsquedas por categoría (filtros)
productoSchema.index({ categoria: 1 });

// Índice en vendedor → acelera buscar productos de un usuario específico
productoSchema.index({ vendedor: 1 });

/**
 * EXPORTACIÓN DEL MODELO
 *
 * Nos permite hacer:
 * - Producto.find() → Buscar productos
 * - Producto.create() → Crear producto
 * - producto.vendedor → Acceder al ObjectId del vendedor
 * - producto.populate('vendedor') → Traer los datos completos del vendedor
 */
export default mongoose.model('Producto', productoSchema);
