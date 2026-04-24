#MerkaUnac

Plataforma web de promoción comunitaria para la Corporación Universitaria Adventista (UNAC), enfocada en la compra, venta e intercambio de productos dentro del entorno universitario.

# Descripción

MerkaUnac surge como solución a la desorganización del comercio interno en la UNAC, donde actualmente las transacciones se realizan mediante medios informales como WhatsApp.

La plataforma busca centralizar la información, mejorar la visibilidad de productos y facilitar la conexión directa entre compradores y vendedores dentro de la comunidad universitaria.

# Estado del proyecto

Actualmente el proyecto ha evolucionado de una aplicación básica a una arquitectura más completa:

Frontend desarrollado en React
Backend con Node.js + Express
Base de datos en MongoDB Atlas
Estructura separada cliente-servidor
# Funcionalidades actuales
Visualización de catálogo de productos desde base de datos
Filtros por categoría y búsqueda por texto
Vista detallada de cada producto
Redirección a login/registro al intentar comprar
Publicación de productos (en desarrollo para usuarios reales)
Conexión con backend y base de datos en la nube
# Tecnologías utilizadas
Frontend
React
JavaScript
CSS
Backend
Node.js
Express
Base de datos
MongoDB Atlas
# Instalación y ejecución

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

# 1️ Clonar el repositorio
git clone https://github.com/WashOrt26/MerkaUnac.git
cd MerkaUnac
# 2️ Instalar dependencias

npm install

# 3️ Configurar variables de entorno

Crear un archivo .env en la carpeta del backend:

MONGO_URI=tu_cadena_de_conexion_mongodb
PORT=3000

Puedes guiarte del archivo .env.example.

# 4️ Ejecutar el proyecto
Opción recomendada (todo junto)
npm run dev:full
O ejecutar por separado
npm run server   # backend
npm run dev      # frontend
# Acceso
Frontend: http://localhost:5173 (o el puerto configurado)
Backend: http://localhost:4000
$ Notas importantes!!!
Asegúrate de que MongoDB Atlas permita conexiones (IP whitelist)
El archivo .env no debe subirse a GitHub
Este proyecto está en desarrollo activo
