// productos.js 
const productos = [
  {
    id: 1,
    nombre: "Celular Samsung",
    precio: 120000,
    descripcion: "Celular en buen estado, 128GB almacenamiento.",
    imagen: "https://media.falabella.com/falabellaCO/73555668_1/w=1500,h=1500,fit=cover",
    categoria: "Electrónica"
  },
  {
    id: 2,
    nombre: "Bicicleta GW",
    precio: 900000,
    descripcion: "Bicicleta usada pero funcional.",
    imagen: "https://todoparaciclismo.com/cdn/shop/files/DSC_0398_600x.jpg?v=1708458276",
    categoria: "Vehículos"
  },
  {
    id: 3,
    nombre: "Zapatos Usados",
    precio: 60000,
    descripcion: "Zapatos cómodos para uso diario.",
    imagen: "https://http2.mlstatic.com/D_Q_NP_2X_783125-MCO84207853179_042025-T.webp",
    categoria: "Ropa"
  },

  {
    id: 4,
    nombre: "Portátil Lenovo i5",
    precio: 1500000,
    descripcion: "Portátil ideal para estudio, 8GB RAM, 256GB SSD.",
    imagen: "https://http2.mlstatic.com/D_Q_NP_2X_755195-MLA107389262629_022026-T.webp",
    categoria: "Electrónica"
  },
  {
    id: 5,
    nombre: "Calculadora Científica Casio",
    precio: 80000,
    descripcion: "Perfecta para ingeniería, en excelente estado.",
    imagen: "https://lagarza.com.co/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjE1OTA0OCwicHVyIjoiYmxvYl9pZCJ9fQ==--471cc551a29c02ad5736a5da4885f5b9a272da33/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJQTkciLCJyZXNpemVfdG9fZml0IjpbODAwLDgwMF19LCJwdXIiOiJ2YXJpYXRpb24ifX0=--5bc749b878ff7aeaa8c5e47bd558bf4c834c3584/casio%20fx-82es%20plus.PNG?locale=es",
    categoria: "Electrónica"
  },
  {
    id: 6,
    nombre: "Escritorio Pequeño",
    precio: 200000,
    descripcion: "Escritorio compacto ideal para habitaciones de estudiante.",
    imagen: "https://alikdiseno.com/cdn/shop/files/Linz_light_foto_contexto.jpg?v=1770843427",
    categoria: "Hogar"
  },
  {
    id: 7,
    nombre: "Colchón Individual",
    precio: 250000,
    descripcion: "Colchón cómodo, poco uso.",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_656923-MCO109738676683_032026-T.webp",
    categoria: "Hogar"
  },
  {
    id: 8,
    nombre: "Nevera Pequeña",
    precio: 350000,
    descripcion: "Nevera compacta perfecta para residencia estudiantil.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI_ZWxZoK8O_b-uhRiYAyjFuL25ek6hpmzAA&s",
    categoria: "Hogar"
  },
  {
    id: 9,
    nombre: "Alquiler de Habitación",
    precio: 450000,
    descripcion: "Habitación cerca a la universidad, incluye servicios.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ0dFAE3qo85Q5tauDLy5ZXWODJnBjaeyM8g&s",
    categoria: "Servicios"
  },
  {
    id: 10,
    nombre: "Audífonos Bluetooth",
    precio: 70000,
    descripcion: "Buen sonido, batería duradera.",
    imagen: "https://cdn.wallapop.com/images/10420/ja/k3/__/c10420p1166590958/i5884042669.jpg?pictureSize=W640",
    categoria: "Electrónica"
  },
  {
    id: 11,
    nombre: "Impresora HP",
    precio: 180000,
    descripcion: "Funciona correctamente, incluye cartuchos.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXdCud6Zo6Z06oVLg1YsN4qYupaxyiyKY4qg&s",
    categoria: "Electrónica"
  },
  {
    id: 12,
    nombre: "Servicios de Diseño Gráfico",
    precio: 50000,
    descripcion: "Diseño de logos, posters y trabajos académicos.",
    imagen: "https://i.pinimg.com/736x/aa/6d/6e/aa6d6e15a3f8356fecaa06806c3b56f1.jpg",
    categoria: "Servicios"
  },
  {
    id: 13,
    nombre: "Clases de Matemáticas",
    precio: 30000,
    descripcion: "Clases personalizadas para cálculo y álgebra.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRKUbLHkV4r-u7jOHNb-uhr0Et2hmv4hEEfg&s",
    categoria: "Servicios"
  },
  {
    id: 14,
    nombre: "Chaqueta Universitaria",
    precio: 90000,
    descripcion: "Chaqueta en buen estado, talla M.",
    imagen: "https://themerchlist.com/wp-content/uploads/2023/11/Custom-Embroidered-Varsity-Leaver-Bomber-Jackets-with-Design-Logo-Merchlist-4-1.webp",
    categoria: "Ropa"
  },
  {
    id: 15,
    nombre: "Mochila Totto",
    precio: 85000,
    descripcion: "Mochila resistente, ideal para universidad.",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_602500-MCO74199073674_012024-O.webp",
    categoria: "Accesorios"
  },
  {
    id: 16,
    nombre: "Monitor 22 pulgadas",
    precio: 300000,
    descripcion: "Monitor en excelente estado, ideal para estudio.",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_922978-MCO107639725780_032026-T.webp",
    categoria: "Electrónica"
  },
  {
    id: 17,
    nombre: "Teclado Mecánico",
    precio: 150000,
    descripcion: "Teclado RGB, perfecto para programación.",
    imagen: "https://i.ebayimg.com/images/g/c8wAAeSwkoppv0-W/s-l1200.webp",
    categoria: "Electrónica"
  },
  {
    id: 18,
    nombre: "Venta de Postres Caseros",
    precio: 10000,
    descripcion: "Brownies y tortas por encargo.",
    imagen: "https://i.ytimg.com/vi/YOZP0NQ3MZE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDOnGdUBED2JHIothlcsQ_ss06apQ",
    categoria: "Comida"
  },
  {
    id: 19,
    nombre: "Patineta",
    precio: 120000,
    descripcion: "Patineta en buen estado.",
    imagen: "https://liebrenaranja.com/wp-content/uploads/2023/05/IMG_20230527_113558.webp",
    categoria: "Vehículos"
  },
  {
    id: 20,
    nombre: "Libro de Programación",
    precio: 40000,
    descripcion: "Libro de JavaScript para principiantes.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuT6GyZ1m2LVNPNdU5nT2NHODcoQBlxI-lwg&s",
    categoria: "Estudio"
  }
];