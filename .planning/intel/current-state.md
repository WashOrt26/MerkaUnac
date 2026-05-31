# Intel — Estado Actual del Código

**Fecha del análisis:** 2026-05-31
**Analizado por:** Claude Code
**Versión:** PMV Completo

---

## Resumen ejecutivo

El proyecto MerkaUnac tiene el PMV completamente implementado:
- Frontend React + Vite funcional
- Backend Express + MongoDB con autenticación JWT
- Sistema de autenticación con validación de correo institucional
- Wishlist funcional con persistencia en MongoDB
- Slider de imágenes con soporte táctil
- Rutas protegidas para usuarios autenticados

---

## Frontend (React + Vite)

### Estructura de archivos
```
frontend/src/
├── App.jsx                      # Routing con ProtectedRoute
├── main.jsx                     # Entry point con AuthProvider
├── contexts/
│   └── AuthContext.jsx          # ✅ Estado global de autenticación
├── pages/
│   ├── HomePage.jsx             # ✅ Catálogo con filtros
│   ├── ProductDetailPage.jsx     # ✅ Slider + info vendedor
│   ├── AddProductPage.jsx        # ✅ CRUD con auth
│   ├── AuthPage.jsx             # ✅ Login/Register funcional
│   └── WishlistPage.jsx         # ✅ Nueva página de favoritos
├── components/
│   ├── TopBar.jsx               # ✅ Muestra estado de sesión
│   ├── ProductCard.jsx          # ✅ Botón wishlist
│   ├── ImageSlider.jsx          # ✅ Slider con swipe
│   ├── ProductGrid.jsx          # ✅ Grid de productos
│   ├── CategoryFilter.jsx       # ✅ Filtro por categoría
│   └── SearchInput.jsx          # ✅ Input de búsqueda
├── services/
│   ├── productosApi.js          # ✅ Actualizado para ObjectId
│   ├── authApi.js               # ✅ Nuevo - cliente auth
│   └── wishlistApi.js           # ✅ Nuevo - cliente wishlist
└── styles/
    ├── *.css                    # Estilos existentes
    └── wishlist.css             # ✅ Nuevo
```

### Estado de componentes

| Componente | Estado | Notas |
|------------|--------|-------|
| HomePage | ✅ Funcional | Carga desde API, filtros en memoria |
| ProductDetailPage | ✅ Funcional | Slider de imágenes, info vendedor |
| AddProductPage | ✅ Funcional | Auth requerido, múltiples imágenes |
| AuthPage | ✅ Funcional | Validación @unac.edu.co, JWT |
| TopBar | ✅ Funcional | Muestra usuario/logout cuando auth |
| WishlistPage | ✅ Nuevo | Lista de favoritos del usuario |
| ProductCard | ✅ Funcional | Botón wishlist con estado visual |
| ImageSlider | ✅ Nuevo | Navegación + swipe táctil |

---

## Backend (Express + MongoDB)

### Estructura de archivos
```
backend/
├── .env                         # MONGODB_URI, JWT_SECRET
├── server/
│   ├── index.js                 # Rutas API completas
│   ├── models/
│   │   ├── Producto.js          # ✅ ObjectId, imagenes[], vendedor
│   │   └── Usuario.js           # ✅ Nuevo - auth + wishlist
│   ├── routes/
│   │   └── auth.js             # ✅ Nuevo - register, login, me
│   └── middleware/
│       └── auth.js             # ✅ Nuevo - verificación JWT
```

### Rutas API implementadas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | / | Info de salud | ❌ |
| POST | /api/auth/register | Registrar usuario | ❌ |
| POST | /api/auth/login | Iniciar sesión | ❌ |
| GET | /api/auth/me | Usuario actual | ✅ |
| POST | /api/auth/logout | Cerrar sesión | ✅ |
| GET | /api/productos | Listar productos | ❌ |
| GET | /api/productos/:id | Detalle producto | ❌ |
| POST | /api/productos | Crear producto | ✅ |
| DELETE | /api/productos/:id | Eliminar producto | ✅ |
| GET | /api/wishlist | Wishlist usuario | ✅ |
| POST | /api/wishlist/:productoId | Agregar a wishlist | ✅ |
| DELETE | /api/wishlist/:productoId | Quitar de wishlist | ✅ |
| GET | /api/wishlist/check/:productoId | Verificar estado | ✅ |

### Dependencias instaladas
- `express` - Framework web
- `mongoose` - ODM MongoDB
- `cors` - Cross-origin
- `dotenv` - Variables de entorno
- `bcryptjs` - Hash de contraseñas
- `jsonwebtoken` - Tokens JWT

---

## Modelo de Datos Final

### Usuario
```javascript
{
  _id: ObjectId,
  nombre: String,           // required
  correo: String,          // unique, lowercase
  passwordHash: String,    // bcrypt
  telefono: String,        // opcional
  wishlist: [ObjectId]     // refs a Producto
}
```

### Producto
```javascript
{
  _id: ObjectId,
  nombre: String,
  precio: Number,
  descripcion: String,
  imagenes: [String],      // Array de URLs
  categoria: String,
  vendedor: ObjectId,      // ref a Usuario
  estado: String,          // 'disponible' | 'vendido'
  createdAt: Date
}
```

---

## Checklist PMV - Estado Final

| Requisito | Estado |
|-----------|--------|
| Manejo de Sesión | ✅ Completado |
| Registrar usuario | ✅ Completado |
| Catálogo de productos | ✅ Completado |
| Vender un producto | ✅ Completado |
| Contactar vendedor | ✅ Completado |
| Agregar productos deseados | ✅ Completado |
| Filtrar productos | ✅ Completado |
| Slider de imágenes | ✅ Completado |

---

## Archivos modificados/creados

### Backend (nuevos)
- `backend/server/models/Usuario.js` ✨ NUEVO
- `backend/server/routes/auth.js` ✨ NUEVO
- `backend/server/middleware/auth.js` ✨ NUEVO
- `backend/server/index.js` ✏️ ACTUALIZADO

### Frontend (nuevos)
- `frontend/src/contexts/AuthContext.jsx` ✨ NUEVO
- `frontend/src/services/authApi.js` ✨ NUEVO
- `frontend/src/services/wishlistApi.js` ✨ NUEVO
- `frontend/src/pages/WishlistPage.jsx` ✨ NUEVO
- `frontend/src/components/ImageSlider.jsx` ✨ NUEVO
- `frontend/src/styles/wishlist.css` ✨ NUEVO

### Frontend (actualizados)
- `frontend/src/App.jsx` ✏️ ACTUALIZADO
- `frontend/src/main.jsx` ✏️ ACTUALIZADO
- `frontend/src/pages/AuthPage.jsx` ✏️ ACTUALIZADO
- `frontend/src/pages/ProductDetailPage.jsx` ✏️ ACTUALIZADO
- `frontend/src/pages/AddProductPage.jsx` ✏️ ACTUALIZADO
- `frontend/src/components/TopBar.jsx` ✏️ ACTUALIZADO
- `frontend/src/components/ProductCard.jsx` ✏️ ACTUALIZADO
- `frontend/src/services/productosApi.js` ✏️ ACTUALIZADO
- `frontend/src/styles/navbar.css` ✏️ ACTUALIZADO
- `frontend/src/styles/home.css` ✏️ ACTUALIZADO
- `frontend/src/styles/product.css` ✏️ ACTUALIZADO

### Documentación
- `.planning/ROADMAP.md` ✏️ ACTUALIZADO
