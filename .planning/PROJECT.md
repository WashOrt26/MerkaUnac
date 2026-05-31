# MerkaUnac — Sistema de Promoción de Productos Locales

**Versión:** 1.0.0 MVP (Producto Mínimo Viable)
**Stack:** React + Vite + Express + Mongoose + MongoDB Atlas
**Fecha de inicio:** 2026-05-05
**Última actualización:** 2026-05-31

## Resumen del proyecto

MerkaUnac es una plataforma web diseñada para conectar a la comunidad universitaria de la Corporación Universitaria Adventista, permitiendo la promoción y venta de productos y servicios locales. El objetivo es fomentar la economía circular y los vínculos comunitarios.

## Funcionalidades del PMV

| Funcionalidad | Estado |
|---------------|--------|
| Manejo de Sesión | ✅ Completado |
| Registrar usuario | ✅ Completado |
| Catálogo de productos | ✅ Completado |
| Vender un producto | ✅ Completado |
| Contactar vendedor | ✅ Completado |
| Agregar productos deseados (Wishlist) | ✅ Completado |
| Filtrar productos | ✅ Completado |
| Slider de imágenes en detalle | ✅ Completado |

## Stakeholders

- **Desarrolladores:** Maik y colaboradores
- **Usuario final:** Comunidad universitaria (estudiantes, docentes, personal administrativo)

## Restricciones conocidas

- MongoDB Atlas como base de datos (requiere .env con MONGODB_URI)
- Autenticación JWT con validación de correo @unac.edu.co
- Sin sistema de pagos integrado (contacto directo vendedor-comprador)

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite |
| Backend | Express.js |
| Base de datos | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Routing | React Router v7 |

## Estructura del Proyecto

```
MerkaUnac/
├── backend/
│   ├── .env
│   └── server/
│       ├── index.js          # API REST
│       ├── models/
│       │   ├── Producto.js
│       │   └── Usuario.js
│       ├── routes/
│       │   └── auth.js
│       └── middleware/
│           └── auth.js
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── AddProductPage.jsx
│       │   ├── AuthPage.jsx
│       │   └── WishlistPage.jsx
│       ├── components/
│       │   ├── TopBar.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductGrid.jsx
│       │   ├── CategoryFilter.jsx
│       │   ├── SearchInput.jsx
│       │   └── ImageSlider.jsx
│       ├── services/
│       │   ├── productosApi.js
│       │   ├── authApi.js
│       │   └── wishlistApi.js
│       └── styles/
├── .planning/
│   ├── PROJECT.md
│   ├── ROADMAP.md
│   ├── intel/
│   ├── project/
│   └── user/
├── package.json
└── README.md
```

## Ejecutar el proyecto

```bash
# Instalar dependencias
npm install

# Desarrollo completo
npm run dev:full

# Separado
npm run server    # Backend (puerto 4000)
npm run dev       # Frontend (puerto 5173)
```
