// agregar-producto.js - Lógica de la página de agregar productos

document.addEventListener('DOMContentLoaded', () => {
  // Cargar productos del localStorage al iniciar
  function cargarProductosLocales() {
    const productosLocales = JSON.parse(localStorage.getItem('productosAdicionales')) || [];
    return productosLocales;
  }

  // Guardar productos en localStorage
  function guardarProductosLocales(prods) {
    localStorage.setItem('productosAdicionales', JSON.stringify(prods));
  }

  // Mostrar lista de productos
  function mostrarLista() {
    const productosLocales = cargarProductosLocales();
    const lista = document.getElementById('lista');
    
    if (productosLocales.length === 0) {
      lista.innerHTML = '<p style="text-align: center; color: #999;">No hay productos agregados aún.</p>';
      return;
    }
    
    lista.innerHTML = '';
    productosLocales.forEach((prod, index) => {
      const div = document.createElement('div');
      div.className = 'producto-item';
      div.innerHTML = `
        <div class="producto-info">
          <h4>${prod.nombre}</h4>
          <p><strong>Precio:</strong> $${prod.precio.toLocaleString()}</p>
          <p><strong>Categoría:</strong> ${prod.categoria}</p>
        </div>
        <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
      `;
      lista.appendChild(div);
    });
  }

  // Eliminar producto
  window.eliminarProducto = function(index) {
    const productosLocales = cargarProductosLocales();
    productosLocales.splice(index, 1);
    guardarProductosLocales(productosLocales);
    mostrarLista();
    mostrarMensaje('Producto eliminado correctamente', 'exito');
  };

  // Mostrar mensaje
  function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.style.display = 'block';
    
    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 3000);
  }

  // Manejar envío del formulario
  document.getElementById('formulario-producto').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener datos del formulario
    const nuevoProducto = {
      id: Date.now(),
      nombre: document.getElementById('nombre').value,
      precio: parseInt(document.getElementById('precio').value),
      descripcion: document.getElementById('descripcion').value,
      imagen: document.getElementById('imagen').value,
      categoria: document.getElementById('categoria').value
    };
    
    // Validar que no esté vacío
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }
    
    // Guardar en localStorage
    const productosLocales = cargarProductosLocales();
    productosLocales.push(nuevoProducto);
    guardarProductosLocales(productosLocales);
    
    // Limpiar formulario
    document.getElementById('formulario-producto').reset();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('✓ Producto agregado correctamente', 'exito');
    
    // Actualizar lista
    mostrarLista();
  });

  // Cargar lista al iniciar
  mostrarLista();
});
