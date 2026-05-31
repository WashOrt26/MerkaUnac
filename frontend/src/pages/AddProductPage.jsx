import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { CATEGORIAS } from '../utils/products';
import { createProducto, deleteProducto, fetchMisProductos } from '../services/productosApi';
import { actualizarTelefono } from '../services/authApi';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';
import '../styles/add-product.css';

const initialForm = {
  nombre: '',
  precio: '',
  descripcion: '',
  imagenes: '',
  categoria: '',
  telefono: '',
};

/**
 * Página de administración para crear y borrar productos.
 *
 * Requiere autenticación (protegida por ProtectedRoute en App.jsx).
 */
function AddProductPage() {
  const navigate = useNavigate();
  const { token, usuario, actualizarUsuario } = useAuth();

  const [form, setForm] = useState({ ...initialForm, telefono: usuario?.telefono || '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [productosDb, setProductosDb] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  /**
   * Recarga la lista de productos del usuario desde la API.
   */
  const recargarLista = async () => {
    setCargandoLista(true);
    try {
      const lista = await fetchMisProductos(token);
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
        const lista = await fetchMisProductos(token);
        if (!cancelado) setProductosDb(lista);
      } catch {
        if (!cancelado) setProductosDb([]);
      } finally {
        if (!cancelado) setCargandoLista(false);
      }
    })();

    return () => { cancelado = true; };
  }, [token]);

  /**
   * Muestra un mensaje temporal en pantalla.
   */
  const showMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
  };

  /**
   * Procesa el envío del formulario y crea el producto.
   */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.precio || !form.descripcion || !form.imagenes || !form.categoria) {
      showMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    const precioNum = Number(form.precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      showMensaje('Precio inválido', 'error');
      return;
    }

    // Normalizar imágenes a array (separadas por newline o coma)
    const imagenesArray = form.imagenes
      .split(/[\n,]/)
      .map(img => img.trim())
      .filter(img => img.length > 0);

    if (imagenesArray.length === 0) {
      showMensaje('Debes proporcionar al menos una URL de imagen', 'error');
      return;
    }

    try {
      // Actualizar teléfono del usuario si lo proporcionó
      if (form.telefono && form.telefono !== usuario?.telefono) {
        try {
          await actualizarTelefono(form.telefono, token);
          actualizarUsuario({ telefono: form.telefono });
        } catch {
          // Si falla, continuamos igual - no es crítico
        }
      }

      await createProducto({
        nombre: form.nombre,
        precio: precioNum,
        descripcion: form.descripcion,
        imagenes: imagenesArray,
        categoria: form.categoria,
      }, token);

      setForm({ ...initialForm, telefono: form.telefono });
      await recargarLista();
      showMensaje('✓ Producto agregado correctamente', 'exito');
    } catch (err) {
      showMensaje(err instanceof Error ? err.message : 'Error al guardar', 'error');
    }
  };

  /**
   * Elimina un producto y refresca el listado.
   */
  const onDelete = async (id) => {
    try {
      await deleteProducto(id, token);
      await recargarLista();
      showMensaje('Producto eliminado correctamente', 'exito');
    } catch (err) {
      showMensaje(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    }
  };

  return (
    <div className="add-product-page">
      <TopBar showSearch={false} showAddButton showAuthButton={false} backToHome />

      <div className="container-form">
        <h1>Agregar Nuevo Producto</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Producto *</label>
            <input
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio *</label>
            <input
              id="precio"
              type="number"
              min="0"
              step="any"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="imagenes">URL(s) de Imagen(es) *</label>
            <textarea
              id="imagenes"
              value={form.imagenes}
              onChange={(e) => setForm({ ...form, imagenes: e.target.value })}
              placeholder="Pega una o varias URLs de imagen, separadas por Enter o coma"
              required
            />
            <small style={{ color: '#64748B', fontSize: '12px' }}>
              Puedes agregar varias imágenes pegando cada URL en una línea nueva
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              required
            >
              <option value="">-- Selecciona una categoría --</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono o WhatsApp para ser contactado</label>
            <input
              id="telefono"
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="Ej: 3001234567"
            />
            <small style={{ color: '#64748B', fontSize: '12px' }}>
              Este número se mostrará a los compradores interesados
            </small>
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-submit">Agregar Producto</button>
            <button type="button" className="btn btn-cancel" onClick={() => setForm(initialForm)}>
              Limpiar Formulario
            </button>
          </div>
        </form>
        {mensaje.texto ? (
          <div className={`mensaje ${mensaje.tipo}`} style={{ display: 'block' }}>
            {mensaje.texto}
          </div>
        ) : null}
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
              <div className="producto-item" key={prod._id}>
                <div className="producto-info">
                  <h4>{prod.nombre}</h4>
                  <p><strong>Precio:</strong> ${prod.precio.toLocaleString()}</p>
                  <p><strong>Categoría:</strong> {prod.categoria}</p>
                  {prod.vendedor?.nombre && (
                    <p><strong>Vendedor:</strong> {prod.vendedor.nombre}</p>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => onDelete(prod._id)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;
