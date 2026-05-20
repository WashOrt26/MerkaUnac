# Intel — Estado Actual del Código

**Fecha del análisis:** 2026-05-05
**Analizado por:** Claude Code

## Resumen ejecutivo

El proyecto MerkaUnac tiene un frontend React + Vite funcional y un backend Express + MongoDB con CRUD completo de productos. La funcionalidad de autenticación está **maquetada pero no implementada**.

---

## Frontend (React + Vite)

### Estructura de archivos
```
frontend/src/
├── App.jsx                    # Routing (5 rutas)
├── main.jsx                   # Entry point
├── pages/
│   ├── HomePage.jsx           # ✅ Catálogo con filtros
│   ├── ProductDetailPage.jsx  # ⚠️ Vista básica, falta slider
│   ├── AddProductPage.jsx     # ✅ CRUD productos (sin auth)
│   └── AuthPage.jsx           # ❌ Solo maquetación
├── components/
│   ├── TopBar.jsx             # Navbar con búsqueda
│   ├── ProductCard.jsx        # Tarjeta simple
│   ├── ProductGrid.jsx        # Grid de productos
│   ├── CategoryFilter.jsx     # Filtro por categoría
│   └── SearchInput.jsx        # Input de búsqueda
├── services/
│   └── productosApi.js        # ✅ Cliente HTTP completo
├── styles/
│   └── *.css                  # Estilos separados por página
└── utils/
    └── products.js           # Constantes y filter logic
```

### Estado de componentes

| Componente | Estado | Notas |
|------------|--------|-------|
| HomePage | ✅ Funcional | Carga desde API, filtros en memoria |
| ProductDetailPage | ⚠️ Parcial | Solo una imagen, falta slider |
| AddProductPage | ✅ Funcional | CRUD completo, sin restricción de auth |
| AuthPage | ❌ Maquetación | UI lista, sin lógica de autenticación |
| TopBar | ⚠️ Parcial | No muestra estado de sesión |

### Servicios API actuales

**productosApi.js** exporta:
- `fetchProductos()` - GET /api/productos
- `fetchProductoById(id)` - GET /api/productos/:id
- `createProducto(payload)` - POST /api/productos
- `deleteProducto(id)` - DELETE /api/productos/:id

---

## Backend (Express + MongoDB)

### Estructura de archivos
```
backend/
├── .env                       # ⚠️ REQUERIDO (MONGODB_URI)
├── server/
│   ├── index.js               # API REST completa
│   └── models/
│       └── Producto.js        # Esquema Mongoose
└── (node_modules/)
```

### Modelo Producto actual
```javascript
{
  id: Number,        // id de negocio (único)
  nombre: String,
  precio: Number,
  descripcion: String,
  imagen: String,     // URL única - ⚠️ debería ser array
  categoria: String
}
```

### Rutas API actuales
| Método | Ruta | Descripción | Estado |
|--------|------|-------------|--------|
| GET | / | Info de salud | ✅ |
| GET | /api/productos | Listar todos | ✅ |
| GET | /api/productos/:id | Detalle | ✅ |
| POST | /api/productos | Crear | ✅ |
| DELETE | /api/productos/:id | Eliminar | ✅ |

### Dependencias detectadas
- `express` - Framework web
- `mongoose` - ODM MongoDB
- `cors` - Cross-origin
- `dotenv` - Variables de entorno

---

## Funcionalidades PMV - Análisis de Gap

| Requisito PMV | Implementado | Gap Analysis |
|---------------|-------------|--------------|
| Manejo de Sesión | ❌ | No existe AuthContext, no hay JWT |
| Registrar usuario | ❌ | AuthPage es solo UI, no hay endpoint |
| Catálogo de productos | ✅ | Completo |
| Vender un producto | ⚠️ | Crea productos, pero sin usuario asociado |
| Contactar vendedor | ❌ | No hay modelo Usuario con datos de contacto |
| Agregar deseados | ❌ | No existe wishlist |
| Filtrar productos | ✅ | Filtro por categoría y búsqueda |

---

## Dependencias faltantes para implementar Auth

### Backend
```bash
npm install bcryptjs jsonwebtoken
```

### Frontend
```bash
# Ya tiene react-router-dom
# Solo necesita Context API (built-in)
```

---

## Patrones detectados en el código

1. **Fetch con cleanup:** Los useEffect usan variable `cancelado` para evitar setState en componentes desmontados. ✅ Good pattern.

2. **API responses:** El backend omite `_id` de MongoDB en respuestas JSON. ✅ Consistente.

3. **IDs de negocio:** Usa `id` numérico secuencial en lugar de `ObjectId` de Mongo. ⚠️ Decisión de diseño a reconsiderar para usuarios.

4. **Rutas relativas:** El frontend usa `/api/...` para que Vite proxifique. ✅ Correcto para dev.

5. **Separación de estilos:** Cada página tiene su propio CSS. ✅ Mantenible.

---

## Recomendaciones inmediatas

1. **Prioridad 1:** Implementar autenticación (Auth) - bloqueante para otras features
2. **Prioridad 2:** Asociar productos a usuarios (vendedorId)
3. **Prioridad 3:** Modelo Usuario con datos de contacto
4. **Prioridad 4:** Wishlist embebido en Usuario o colección separada

---

## Archivos a modificar/crear para Auth

### Backend (nuevos)
- `backend/server/models/Usuario.js`
- `backend/server/routes/auth.js` (o añadir a index.js)
- `backend/server/middleware/auth.js` (verificación JWT)

### Frontend (nuevos/modificados)
- `frontend/src/contexts/AuthContext.jsx` (nuevo)
- `frontend/src/services/authApi.js` (nuevo)
- `frontend/src/pages/AuthPage.jsx` (modificar)
- `frontend/src/components/TopBar.jsx` (modificar)
- `frontend/src/App.jsx` (proteger rutas)