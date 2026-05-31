/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                           MODELO DE USUARIO                                 ║
 * ║                                                                              ║
 * ║  Este archivo define cómo se guardan los usuarios en MongoDB.              ║
 * ║                                                                              ║
 * ║  CONCEPTOS CLAVE:                                                          ║
 * ║  - Schema: Define la estructura de los documentos en MongoDB               ║
 * ║  - Model: Es como una "clase" que nos permite interactuar con la BD        ║
 * ║  - ObjectId: Identificador único que MongoDB genera automáticamente         ║
 * ║  - ref: Referencia a otro modelo (como una llave foránea)                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import mongoose from 'mongoose';

/**
 * Definición del esquema de usuario.
 *
 * CADA CAMPO EXPLICADO:
 *
 * - nombre: String requerido - El nombre completo del usuario
 *
 * - correo: String único - Email institucional del usuario.
 *   * unique: true → No puede haber dos usuarios con el mismo email
 *   * lowercase: true → Se guarda en minúsculas automáticamente
 *   * trim: true → Se eliminan espacios al inicio y final
 *
 * - passwordHash: String requerido - La contraseña hasheada.
 *   NUNCA guardamos contraseñas en texto plano por seguridad.
 *   Usamos bcrypt para hashear (lo verás en auth.js)
 *
 * - telefono: String opcional - Número de contacto del usuario.
 *   Puede estar vacío si el usuario no lo proporciona.
 *
 * - wishlist: Array de ObjectIds - Lista de productos favoritos.
 *   * ref: 'Producto' → Indica que estos IDs se refieren al modelo Producto
 *   * Es como una "relación" pero guardada en el mismo documento
 *   * MongoDB llama a esto "documentos embebidos" o "arrays de referencias"
 */
const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,    // Obligatorio
      trim: true         // Sin espacios al inicio/final
    },

    correo: {
      type: String,
      required: true,    // Obligatorio
      unique: true,      // No puede repetirse
      lowercase: true,   // Se guarda en minúsculas
      trim: true         // Sin espacios
    },

    passwordHash: {
      type: String,
      required: true     // Obligatorio (contraseña hasheada)
    },

    telefono: {
      type: String,
      default: ''        // Valor por defecto si no se proporciona
    },

    // Wishlist: array de referencias a productos
    // Cada elemento es un ObjectId que apunta a un documento en la colección 'productos'
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    }]
  },
  {
    versionKey: false,   // No crear campo __v de versioning de Mongoose
    collection: 'usuarios' // Nombre exacto de la colección en MongoDB
  }
);

/**
 * EXPORTACIÓN DEL MODELO
 *
 * mongoose.model('Usuario', usuarioSchema) crea un modelo llamado 'Usuario'.
 * Este modelo nos permite:
 * - Usuario.find() → Buscar usuarios
 * - Usuario.create() → Crear usuario
 * - usuario.save() → Guardar cambios
 * etc.
 */
export default mongoose.model('Usuario', usuarioSchema);
