// producto.js - Lógica de la página de detalle de producto

document.addEventListener('DOMContentLoaded', () => {
  const productosLocales = JSON.parse(localStorage.getItem('productosAdicionales')) || [];
  const todosProductos = [...productos, ...productosLocales];

  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const producto = todosProductos.find(p => p.id === id);

  if (producto) {
    document.querySelector('.container-title').textContent = producto.nombre;
    // Imagen principal
    document.querySelector('.container-img img').src = producto.imagen;
    document.querySelector('.container-img img').alt = producto.nombre;
    // Precio
    document.querySelector('.container-price span').textContent = `$${producto.precio.toLocaleString()}`;
    // Descripción
    document.querySelector('.text-description p').textContent = producto.descripcion;
  } else {
    document.querySelector('main').innerHTML = '<p>Producto no encontrado.</p>';
  }
});
