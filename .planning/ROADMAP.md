# ROADMAP — MerkaUnac PMV

## Resumen de progreso

| Fase | Nombre | Estado | Notas |
|------|--------|---------|-------|
| 0 | Preparación del proyecto | ✅ Completada | - |
| 1 | Sistema de Autenticación | ✅ Completada | - |
| 2 | Wishlist (Lista de Deseados) | ⚠️ Con bugs | Ver PENDIENTES.md |
| 3 | Slider de Imágenes | ✅ Completada | - |
| 4 | Flujo de Compra | ✅ Completada | - |
| 5 | Proteger Rutas | ✅ Completada | - |
| 6 | Documentación | ✅ Completada | - |

---

## ⚠️ Bug Conocido: Wishlist

**Ver archivo:** [PENDIENTES.md](./PENDIENTES.md)

La funcionalidad de wishlist tiene un bug conocido donde aparece "Error al obtener wishlist".

**Estado:** Pendiente de arreglar

---

## 🎨 Mejoras Opcionales (Ver PENDIENTES.md)

### Mejora de Diseño Visual (BAJA PRIORIDAD)

**Descripción:** El frontend funciona pero el diseño visual podría mejorar.

**Ideas:**
- Mejor paleta de colores coherente
- Animaciones suaves
- Spinners de loading
- Toast notifications
- Iconos consistentes

**Prioridad:** BAJA - Solo estético, no afecta funcionalidad

---

## Fase 1: Sistema de Autenticación ✅ COMPLETADA

**Objetivo:** Implementar registro, login y manejo de sesiones de usuarios.

### Tasks completadas
- [x] **1.1** Crear modelo de Usuario en MongoDB (`Usuario.js`)
- [x] **1.2** Crear API de autenticación:
  - [x] POST /api/auth/register - Registrar nuevo usuario
  - [x] POST /api/auth/login - Iniciar sesión (generar JWT)
  - [x] GET /api/auth/me - Obtener usuario actual (protegido)
  - [x] POST /api/auth/logout - Invalidar sesión
- [x] **1.3** Crear servicio de autenticación en frontend (`authApi.js`)
- [x] **1.4** Implementar Context API para estado de autenticación (`AuthContext.jsx`)
- [x] **1.5** Actualizar `AuthPage.jsx` con funcionalidad real
- [x] **1.6** Actualizar `TopBar.jsx` para mostrar estado de sesión
- [x] **1.7** Proteger rutas que requieren autenticación

**Criterios de aceptación:**
- ✅ Usuario puede registrarse con nombre, email y contraseña
- ✅ Solo acepta correos institucionales (@unac.edu.co)
- ✅ Usuario puede iniciar sesión y recibir un token JWT
- ✅ La sesión persiste al recargar la página (localStorage)
- ✅ Botón "Iniciar sesión" cambia a nombre de usuario cuando logueado
- ✅ Solo usuarios autenticados pueden agregar productos

---

## Fase 2: Wishlist (Lista de Deseados) ⚠️ CON BUGS

**Objetivo:** Permitir a usuarios autenticados marcar productos como favoritos.

### Tasks implementadas
- [x] **2.1** Wishlist embebido en modelo Usuario
- [x] **2.2** API de productos:
  - [x] GET /api/wishlist - Listar productos en wishlist
  - [x] POST /api/wishlist/:productoId - Agregar a wishlist
  - [x] DELETE /api/wishlist/:productoId - Quitar de wishlist
  - [x] GET /api/wishlist/check/:productoId - Verificar estado
- [x] **2.3** Botón "♡" en ProductCard y ProductDetailPage
- [x] **2.4** Página /wishlist para ver productos guardados

### ⚠️ Bug conocido
- Error "Error al obtener wishlist" al cargar la página de wishlist
- Ver [PENDIENTES.md](./PENDIENTES.md) para detalles

---

## Fase 3: Slider de Imágenes ✅ COMPLETADA

**Objetivo:** Permitir que los productos tengan múltiples imágenes.

### Tasks completadas
- [x] **3.1** Cambiar modelo Producto: `imagen` → `imagenes` (array de URLs)
- [x] **3.2** Componente `ImageSlider.jsx` con navegación por flechas y dots
- [x] **3.3** Actualizar ProductDetailPage para usar el slider
- [x] **3.4** Soporte swipe en móviles
- [x] **3.5** Actualizar AddProductPage para múltiples imágenes

**Criterios de aceptación:**
- ✅ Productos pueden tener 1-N imágenes
- ✅ Slider permite navegar entre imágenes con flechas o dots
- ✅ Fallback si solo hay una imagen (mostrar estática)

---

## Fase 4: Contactar Vendedor ✅ COMPLETADA

**Objetivo:** Permitir a compradores contactar vendedores directamente.

### Tasks completadas
- [x] **4.1** Modelo Producto con referencia a Usuario (vendedor)
- [x] **4.2** ProductoDetailPage muestra info del vendedor (nombre, correo, teléfono)
- [x] **4.3** Botón "Contactar" redirige a login si no autenticado
- [x] **4.4** Info del vendedor solo visible después de hacer clic en "Contactar"

---

## Fase 5: Proteger Rutas ✅ COMPLETADA

### Tasks completadas
- [x] **5.1** ProtectedRoute envuelve rutas que requieren auth
- [x] **5.2** /agregar-producto redirige a login si no autenticado
- [x] **5.3** /wishlist redirige a login si no autenticado

---

## Fase 6: Refinamiento y Documentación ✅ COMPLETADA

### Tasks completadas
- [x] **6.1** Informe técnico final (`~/Desktop/MerkaUnac_Implementacion_MVP.md`)
- [x] **6.2** Documentación con comentarios comprensivos
- [x] **6.3** Problemas y pendientes documentados (`PENDIENTES.md`)

---

## Arquitectura de Datos

### Modelo Usuario
```javascript
{
  _id: ObjectId,           // Identificador MongoDB
  nombre: String,           // Nombre completo
  correo: String,          // Email institucional (único)
  passwordHash: String,    // bcrypt hash
  telefono: String,        // Opcional
  wishlist: [ObjectId]     // Referencias a productos
}
```

### Modelo Producto
```javascript
{
  _id: ObjectId,          // Identificador MongoDB
  nombre: String,
  precio: Number,
  descripcion: String,
  imagenes: [String],      // Array de URLs
  categoria: String,
  vendedor: ObjectId,      // Referencia a Usuario
  estado: String,          // 'disponible' | 'vendido'
  createdAt: Date
}
```

---

## Notas para desarrolladores

1. **Ejecución:** `npm run dev:full` desde la raíz inicia frontend + backend.
2. **Tokens:** JWT con expiración de 7 días, almacenado en localStorage.
3. **Seguridad:** Contraseñas hasheadas con bcryptjs (salt rounds: 10).
4. **Validación:** Correos institucionales validados en frontend y backend.
5. **Middleware:** `authMiddleware` protege rutas que requieren autenticación.
6. **Frontend cambios:** Se ven automáticamente (hot-reload de Vite).
7. **Backend cambios:** Requiere reiniciar el servidor.

---

## Checklist de entrega PMV

- [x] Manejo de Sesión funciona
- [x] Registrar usuario funciona (solo @unac.edu.co)
- [x] Catálogo de productos visible
- [x] Vender un producto (usuarios autenticados)
- [x] Contactar vendedor funciona
- [ ] ~~Agregar productos deseados funciona~~ ⚠️ Bug conocido
- [x] Filtrar productos funciona
- [x] Slider de imágenes funciona

---

## Archivos de Documentación

| Archivo | Descripción |
|---------|-------------|
| `PROJECT.md` | Descripción general del proyecto |
| `ROADMAP.md` | Este archivo - Roadmap y estado |
| `intel/current-state.md` | Estado actual del código |
| `PENDIENTES.md` | Bugs y mejoras opcionales |
| `../../MerkaUnac_Implementacion_MVP.md` | Informe técnico completo |
