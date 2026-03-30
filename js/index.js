// index.js - Lógica de la página principal

const productsContainer = document.querySelector('.products');

let categoriaSeleccionada = null;
let busquedaActual = '';

function cargarTodosProductos() {
  const productosLocales = JSON.parse(localStorage.getItem('productosAdicionales')) || [];
  return [...productos, ...productosLocales];
}

let todosProductos = cargarTodosProductos();

function crearTarjetaProducto(producto) {
  return `
    <button class="card" data-id="${producto.id}" data-url="producto.html?id=${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>$${producto.precio.toLocaleString()}</h3>
      <p>${producto.nombre}</p>

    </button>
  `;
}

function renderizarProductos(filtro = {}) {
  productsContainer.innerHTML = '';
  todosProductos
    .filter(p => !filtro.categoria || p.categoria === filtro.categoria)
    .filter(p => !filtro.busqueda || p.nombre.toLowerCase().includes(filtro.busqueda.toLowerCase()))
    .forEach(producto => {
      productsContainer.insertAdjacentHTML('beforeend', crearTarjetaProducto(producto));
    });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-url');
      if (url) window.location.href = url;
    });
  });
}

function inicializar() {
  renderizarProductos();

  const inputBuscar = document.querySelector('header input[type="text"]');
  inputBuscar.addEventListener('input', () => {
    busquedaActual = inputBuscar.value;
    renderizarProductos({ 
      categoria: categoriaSeleccionada, 
      busqueda: busquedaActual 
    });
  });

  const botonesCategoria = document.querySelectorAll('.categories button');
  botonesCategoria.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.textContent.split(' ')[1];
      
      if (categoriaSeleccionada === cat) {
        categoriaSeleccionada = null;
        btn.style.backgroundColor = ''; 
      } else {
        categoriaSeleccionada = cat;
        botonesCategoria.forEach(b => b.style.backgroundColor = '');
        btn.style.backgroundColor = '#007bff';
        btn.style.color = 'white';
      }
      
      renderizarProductos({ 
        categoria: categoriaSeleccionada, 
        busqueda: busquedaActual 
      });
    });
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar);

// Escuchar cambios en localStorage desde otras pestañas
window.addEventListener('storage', () => {
  todosProductos = cargarTodosProductos();
  renderizarProductos({ 
    categoria: categoriaSeleccionada, 
    busqueda: busquedaActual 
  });
});
