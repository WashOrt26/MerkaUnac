# RESEARCH — MerkaUnac PMV

## Stack tecnológico elegido

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Frontend | React + Vite | Ecosistema moderno, hot-reload rápido |
| Backend | Express.js | Ligero, flexible, bien documentado |
| Base de datos | MongoDB Atlas | Gratuito, flexible, fácil prototipado |
| ODM | Mongoose | Validación de esquemas, query builder |
| Routing | React Router v6 | Estándar para SPA |
| Auth | JWT + bcryptjs | Sin estado, estándar industry |

## Arquitectura de autenticación

### Flujo de autenticación

```
1. Usuario llena formulario (login/register)
2. Frontend envía credenciales a /api/auth/*
3. Backend:
   - Register: Hashea password con bcrypt → guarda usuario → genera JWT
   - Login: Busca usuario → compara password → genera JWT
4. Backend responde con { token, user }
5. Frontend guarda token en localStorage
6. AuthContext actualiza estado global
7. Requests subsiguientes incluyen header: Authorization: Bearer <token>
```

### Estructura de tokens

```javascript
// JWT payload
{
  userId: Number,        // o string si usamos ObjectId
  username: String,
  exp: Date + 7 days
}
```

### Middleware de protección

```javascript
// Patrón para endpoints protegidos
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No autenticado' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};
```

## Modelo de datos propuesto

### Usuario
```javascript
{
  id: Number,           // id de negocio
  nombre: String,       // Nombre completo
  username: String,    // Nombre de usuario (único)
  email: String,        // Email (único)
  passwordHash: String, // bcrypt hash
  telefono: String,    // Para contactar
  whatsapp: String,     // Opcional
  fechaRegistro: Date,
  productos: [Number]   // IDs de productos que vende
}
```

### Wishlist (opciones)
1. **Embebido en Usuario:** `wishlist: [Number]` (array de producto IDs)
2. **Colección separada:**
   ```javascript
   { usuarioId: Number, productoId: Number }
   ```

Recomendación: Opción 1 para PMV (más simple).

### Producto (extensión)
```javascript
// Agregar campo:
vendedorId: Number  // Referencia al usuario que lo creó
```

## Wishlist - Implementación

### Backend
```javascript
// En routes/auth.js o routes/wishlist.js
router.post('/wishlist/:productoId', authMiddleware, async (req, res) => {
  const user = await Usuario.findById(req.user.userId);
  if (!user.wishlist.includes(req.params.productoId)) {
    user.wishlist.push(req.params.productoId);
    await user.save();
  }
  res.json({ wishlist: user.wishlist });
});

router.get('/wishlist', authMiddleware, async (req, res) => {
  const user = await Usuario.findById(req.user.userId).populate('wishlist');
  res.json(user.wishlist);
});
```

### Frontend
```javascript
// services/wishlistApi.js
export const addToWishlist = (productoId) => ...;
export const removeFromWishlist = (productoId) => ...;
export const fetchWishlist = () => ...;
```

## Slider de imágenes

### Opción 1: Carousel nativo CSS
```css
.slider { overflow: hidden; }
.slides { display: flex; transition: transform 0.3s; }
.slide { min-width: 100%; }
```

### Opción 2: Librería lightweight
- `react-swipeable` - Gestos táctiles
- `swiper` - Más completo pero más pesado

Recomendación: Opción 1 para PMV (CSS puro, sin dependencias extra).

## Recursos útiles

- [JWT Best Practices](https://auth0.com/blog/refresh-tokens-what-are-the-they-and-when-to-use-them/)
- [Mongoose Populate](https://mongoosejs.com/docs/populate.html)
- [bcryptjs docs](https://www.npmjs.com/package/bcryptjs)