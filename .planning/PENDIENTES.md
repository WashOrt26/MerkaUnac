# Pendientes y Problemas Conocidos - MerkaUnac

**Última actualización:** 2026-05-31

---

## 🐛 Bugs / Problemas Conocidos

### 1. Wishlist no funciona correctamente ⚠️ PRIORIDAD MEDIA

**Descripción:** Al intentar agregar productos a la wishlist, aparece "Error al obtener wishlist".

**Estado:** En investigación

**Síntomas:**
- El endpoint `/api/wishlist` devuelve error cuando se llama desde el frontend
- Los productos no se guardan en la wishlist del usuario
- Error visible en la UI de WishlistPage

**Pasos para reproducir:**
1. Iniciar sesión con usuario existente
2. Ir a cualquier producto
3. Clic en el corazón (wishlist)
4. Ir a "Mi Lista de Deseados"
5. Aparece "Error al obtener wishlist"

**Hipótesis:**
- Puede ser un problema con `.populate()` en la ruta de wishlist
- Los productos en la DB pueden tener formato inconsistente

**Solución pendiente:** Revisar la función `formatearWishlistProducto()` y el populate en `/api/wishlist`

---

## 🎨 Mejoras Opcionales (Baja Prioridad)

### 2. Mejorar diseño visual del frontend

**Descripción:** El frontend funciona pero el diseño visual podría mejorar significativamente.

**Ideas de mejora:**
- Mejor paleta de colores coherente
- Animaciones suaves en transiciones
- Indicadores de loading (spinners)
- Toast notifications para feedback de acciones
- Diseño más moderno y atractivo
- Responsive design optimizado para móvil
- Iconos consistentes (usar biblioteca como Lucide o Heroicons)

**Prioridad:** BAJA (funcionalidad completa, solo es estética)

**Estado:** Pendiente (opcional para después del MVP)

---

## 📝 Notas

- El backend ya tiene los cambios para arreglar wishlist en el código fuente
- El servidor puede necesitar reinicio para aplicar cambios
- El frontend tiene hot-reload, así que cambios se ven automáticamente
