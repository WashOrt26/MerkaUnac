import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import { CATEGORIAS } from '../utils/products';
import { createProducto, deleteProducto, fetchProductos } from '../services/productosApi';
import '../styles/navbar.css';
import '../styles/add-product.css';

const initialForm = {
  nombre: '',
  precio: '',
  descripcion: '',
  imagen: '',
  categoria: '',
};

/**
 * Página de administración simple para crear y borrar productos.
 *
 * @returns {JSX.Element} Formulario + lista de productos almacenados en MongoDB.
 */
function AddProductPage() {
  const [form, setForm] = useState(initialForm);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [productosDb, setProductosDb] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  /**
   * Recarga la lista de productos desde la API.
   *
   * @returns {Promise<void>} Termina cuando actualiza estado de carga y lista.
   */
  const recargarLista = async () => {
    setCargandoLista(true);
    try {
      const lista = await fetchProductos();
      setProductosDb(lista);
    } catch {
      setProductosDb([]);
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const lista = await fetchProductos();
        if (!cancelado) setProductosDb(lista);
      } catch {
        if (!cancelado) setProductosDb([]);
      } finally {
        if (!cancelado) setCargandoLista(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  /**
   * Muestra un mensaje temporal en pantalla.
   *
   * @param {string} texto Texto visible para el usuario.
   * @param {'error'|'exito'|string} tipo Clase CSS usada para colorear el aviso.
   */
  const showMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  /**
   * Procesa el envío del formulario y crea el producto.
   *
   * @param {import('react').FormEvent<HTMLFormElement>} e Evento submit del formulario.
   * @returns {Promise<void>} Finaliza cuando termina la validación y la llamada al backend.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.descripcion || !form.imagen || !form.categoria) {
      showMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    const precioNum = Number(form.precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      showMensaje('Precio inválido', 'error');
      return;
    }

    try {
      await createProducto({
        nombre: form.nombre,
        precio: precioNum,
        descripcion: form.descripcion,
        imagen: form.imagen,
        categoria: form.categoria,
      });
      setForm(initialForm);
      await recargarLista();
      showMensaje('✓ Producto agregado correctamente', 'exito');
    } catch (err) {
      showMensaje(err instanceof Error ? err.message : 'Error al guardar', 'error');
    }
  };

  /**
   * Elimina un producto y refresca el listado.
   *
   * @param {number} id Id numérico del producto a borrar.
   * @returns {Promise<void>} Finaliza cuando la API responde y se actualiza la UI.
   */
  const onDelete = async (id) => {
    try {
      await deleteProducto(id);
      await recargarLista();
      showMensaje('Producto eliminado correctamente', 'exito');
    } catch (err) {
      showMensaje(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    }
  };

  return (
    <div className="add-product-page">
      <TopBar showSearch={false} showAddButton={false} showAuthButton={false} backToHome />

      <div className="container-form">
        <h1>Agregar Nuevo Producto</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Producto *</label>
            <input id="nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio *</label>
            <input id="precio" type="number" min="0" step="any" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea id="descripcion" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="imagen">URL de la Imagen *</label>
            <input id="imagen" type="url" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="categoria">Categoría *</label>
            <select id="categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} required>
              <option value="">-- Selecciona una categoría --</option>
              {CATEGORIAS.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
            </select>
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-submit">Agregar Producto</button>
            <button type="button" className="btn btn-cancel" onClick={() => setForm(initialForm)}>Limpiar Formulario</button>
          </div>
        </form>
        {mensaje.texto ? <div className={`mensaje ${mensaje.tipo}`} style={{ display: 'block' }}>{mensaje.texto}</div> : null}
      </div>

      <div className="container-form lista-productos">
        <h2>Productos en base de datos</h2>
        <div className="lista-productos-bd">
          {cargandoLista ? (
            <p style={{ textAlign: 'center', color: '#999' }}>Cargando…</p>
          ) : productosDb.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>No hay productos agregados aún.</p>
          ) : (
            productosDb.map((prod) => (
              <div className="producto-item" key={prod.id}>
                <div className="producto-info">
                  <h4>{prod.nombre}</h4>
                  <p><strong>Precio:</strong> ${prod.precio.toLocaleString()}</p>
                  <p><strong>Categoría:</strong> {prod.categoria}</p>
                </div>
                <button type="button" className="btn-eliminar" onClick={() => onDelete(prod.id)}>Eliminar</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;
