---
name: Repo MerkaUnac
description: Repositorio Git del proyecto MerkaUnac 
type: reference
---

## Ubicación
**Ruta:** https://github.com/WashOrt26/MerkaUnac.git

## Estructura
```
MerkaUnac/
├── .planning/           # Documentación GSD (orquestación)
├── backend/
│   ├── .env             # REQUERIDO: MONGODB_URI
│   └── server/
│       ├── index.js     # API Express
│       └── models/
│           └── Producto.js
├── frontend/
│   └── src/
│       ├── pages/       # HomePage, AuthPage, ProductDetailPage, AddProductPage
│       ├── components/  # TopBar, ProductCard, ProductGrid, etc.
│       ├── services/    # productosApi.js
│       └── styles/      # CSS por página
└── node_modules/
```

## Para ejecutar
```bash
npm run dev:full  # Inicia frontend (5173) + backend (4000)
```