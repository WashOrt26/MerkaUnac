# ROADMAP — MerkaUnac PMV

## Resumen de progreso

| Fase | Nombre | Estado | Bloqueada por |
|------|--------|--------|---------------|
| 0 | Preparación del proyecto | ✅ Completada | - |
| 1 | Sistema de Autenticación | 🔄 En progreso | - |
| 2 | Wishlist (Lista de Deseados) | 📋 Pendiente | Fase 1 |
| 3 | Contactar Vendedor | 📋 Pendiente | Fase 1 |
| 4 | Slider de Imágenes | 📋 Pendiente | - |
| 5 | Refinamiento y Pruebas | 📋 Pendiente | Fases 1-4 |

---

## Fase 1: Sistema de Autenticación 🔄 EN PROGRESO

**Objetivo:** Implementar registro, login y manejo de sesiones de usuarios.

### Tasks

- [ ] **1.1** Crear modelo de Usuario en MongoDB (`Usuario.js`)
- [ ] **1.2** Crear API de autenticación:
  - [ ] POST /api/auth/register - Registrar nuevo usuario
  - [ ] POST /api/auth/login - Iniciar sesión (generar JWT)
  - [ ] GET /api/auth/me - Obtener usuario actual (protegido)
  - [ ] POST /api/auth/logout - Invalidar sesión
- [ ] **1.3** Crear servicio de autenticación en frontend (`authApi.js`)
- [ ] **1.4** Implementar Context API para estado de autenticación (`AuthContext.jsx`)
- [ ] **1.5** Actualizar `AuthPage.jsx` con funcionalidad real:
  - [ ] Validación de inputs
  - [ ] Manejo de errores
  - [ ] Redirección tras éxito
- [ ] **1.6** Actualizar `TopBar.jsx` para mostrar estado de sesión (avatar/nombre cuando logueado)
- [ ] **1.7** Proteger rutas que requieren autenticación (`AddProductPage.jsx`, futuras rutas)

**Criterios de aceptación:**
- Usuario puede registrarse con nombre, email, username y contraseña
- Usuario puede iniciar sesión y recibir un token JWT
- La sesión persiste al recargar la página (localStorage)
- Botón "Iniciar sesión" cambia a nombre de usuario cuando logueado
- Solo usuarios autenticados pueden agregar productos

---

## Fase 2: Wishlist (Lista de Deseados)

**Objetivo:** Permitir a usuarios autenticados marcar productos como favoritos.

### Tasks

- [ ] **2.1** Crear modelo `Wishlist` en MongoDB (o embeber en Usuario)
- [ ] **2.2** Extender API de productos:
  - [ ] POST /api/wishlist/:productoId - Agregar a wishlist
  - [ ] DELETE /api/wishlist/:productoId - Quitar de wishlist
  - [ ] GET /api/wishlist - Listar productos en wishlist (protegido)
- [ ] **2.3** Actualizar frontend:
  - [ ] Botón "♡" en `ProductCard.jsx` y `ProductDetailPage.jsx`
  - [ ] Indicador visual si producto ya está en wishlist
  - [ ] Página/ruta para ver wishlist del usuario
- [ ] **2.4** Mostrar wishlist en el perfil del usuario

**Criterios de aceptación:**
- Solo usuarios autenticados pueden usar wishlist
- El icono cambia visualmente si el producto está en wishlist
- Wishlist se persiste en la base de datos por usuario

---

## Fase 3: Contactar Vendedor

**Objetivo:** Permitir a compradores contactar vendedores directamente.

### Tasks

- [ ] **3.1** Enriquecer modelo Producto con `vendedorId` (referencia a Usuario)
- [ ] **3.2** Enriquecer modelo Usuario con datos de contacto (`telefono`, `whatsapp`)
- [ ] **3.3** Actualizar `AddProductPage.jsx` para asignar productos al usuario autenticado
- [ ] **3.4** Implementar funcionalidad de contacto:
  - [ ] Botón "Contactar" en `ProductDetailPage.jsx`
  - [ ] Mostrar info de contacto del vendedor (si ambos usuarios lo permiten)
  - [ ] Opcional: Modal de mensaje interno

**Criterios de aceptación:**
- Productos agregados se asocian al usuario que los creó
- Comprador puede ver forma de contactar al vendedor
- Vendedor ve sus productos diferenciados en el catálogo

---

## Fase 4: Slider de Imágenes

**Objetivo:** Permitir que los productos tengan múltiples imágenes.

### Tasks

- [ ] **4.1** Cambiar modelo Producto: `imagen` → `imagenes` (array de URLs)
- [ ] **4.2** Actualizar backend para manejar arrays de imágenes
- [ ] **4.3** Implementar componente `ImageSlider.jsx` con navegación
- [ ] **4.4** Actualizar `ProductDetailPage.jsx` para usar el slider
- [ ] **4.5** Actualizar `AddProductPage.jsx` para agregar múltiples imágenes
- [ ] **4.6** Actualizar `ProductCard.jsx` para mostrar imagen principal

**Criterios de aceptación:**
- Productos pueden tener 1-N imágenes
- Slider permite navegar entre imágenes con flechas o dots
- Fallback si solo hay una imagen (mostrar estática)

---

## Fase 5: Refinamiento y Pruebas

**Objetivo:** Asegurar calidad del código y funcionalidad completa del PMV.

### Tasks

- [ ] **5.1** Revisión de código (code review)
- [ ] **5.2** Pruebas de funcionalidad:
  - [ ] Registro y login completo
  - [ ] Agregar producto con usuario logueado
  - [ ] Wishlist funcional
  - [ ] Contactar vendedor visible
  - [ ] Filtros funcionando
- [ ] **5.3** Responsive design en móvil
- [ ] **5.4** Manejo de errores amigable
- [ ] **5.5** Documentación README.md con instrucciones de ejecución

---

## Notas para desarrolladores

1. **Orden de ejecución:** Fase 1 (Auth) es bloqueante para Fases 2 y 3 porque requieren usuario autenticado.
2. **Base de datos:** Necesita `.env` con `MONGODB_URI` válido en `/backend/`.
3. **Ejecución:** `npm run dev:full` desde la raíz inicia frontend + backend.
4. **Tokens:** Usar JWT con expiración de 7 días, almacenar en localStorage.
5. **Seguridad:** Contraseñas hasheadas con bcrypt antes de guardar.

---

## Checklist de entrega PMV

- [ ] Manejo de Sesión funciona
- [ ] Registrar usuario funciona
- [ ] Catálogo de productos visible
- [ ] Vender un producto (usuarios autenticados)
- [ ] Contactar vendedor visible
- [ ] Agregar productos deseados funciona
- [ ] Filtrar productos funciona