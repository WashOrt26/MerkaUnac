import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login, register, validarCorreoInstitucional } from '../services/authApi';
import '../styles/auth.css';

/**
 * Página de autenticación: login y registro con validación de correo institucional.
 *
 * - Solo acepta correos terminados en @unac.edu.co
 * - Usa AuthContext para mantener la sesión.
 * - Redirige al home si ya está autenticado.
 */
function AuthPage() {
  const navigate = useNavigate();
  const { login: loginContext, isAuthenticated, loading } = useAuth();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 850);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', correo: '', password: '', telefono: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Responsive
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 850);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /**
   * Maneja cambios en los inputs del formulario.
   */
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  /**
   * Maneja el envío del formulario de login.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.correo || !formData.password) {
      setError('Completa todos los campos');
      return;
    }

    const validacion = validarCorreoInstitucional(formData.correo);
    if (!validacion.valido) {
      setError(validacion.mensaje);
      return;
    }

    setSubmitting(true);
    try {
      const { token, usuario } = await login({ correo: formData.correo, password: formData.password });
      loginContext(token, usuario);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Maneja el envío del formulario de registro.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.correo || !formData.password) {
      setError('Completa todos los campos');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const validacion = validarCorreoInstitucional(formData.correo);
    if (!validacion.valido) {
      setError(validacion.mensaje);
      return;
    }

    setSubmitting(true);
    try {
      const { token, usuario } = await register({
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password,
        telefono: formData.telefono,
      });
      loginContext(token, usuario);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Alterna entre login y registro, limpia errores y formulario.
   */
  const toggleMode = (modoLogin) => {
    setIsLogin(modoLogin);
    setError('');
    if (modoLogin) {
      setFormData({ nombre: '', correo: '', password: '', telefono: '' });
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <main>
          <div className="contenedor__todo">
            <p style={{ textAlign: 'center' }}>Cargando...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <main>
        <div className="contenedor__todo">
          <div className="caja__trasera">
            <div
              className="caja__trasera-login"
              style={{ display: isDesktop || !isLogin ? 'block' : 'none', opacity: isDesktop ? (isLogin ? 0 : 1) : 1 }}
            >
              <h3>¿Ya tienes una cuenta?</h3>
              <p>Inicia sesión para entrar en la página</p>
              <button type="button" onClick={() => toggleMode(true)}>Iniciar Sesión</button>
            </div>
            <div
              className="caja__trasera-register"
              style={{ display: 'block', opacity: isDesktop ? (isLogin ? 1 : 0) : isLogin ? 1 : 0 }}
            >
              <h3>¿Aún no tienes una cuenta?</h3>
              <p>Regístrate para que puedas iniciar sesión</p>
              <button type="button" onClick={() => toggleMode(false)}>Regístrarse</button>
            </div>
          </div>

          <div
            className="contenedor__login-register"
            style={{ left: isDesktop ? (isLogin ? '10px' : '410px') : '0px' }}
          >
            {/* FORMULARIO LOGIN */}
            <form className="formulario__login" style={{ display: isLogin ? 'block' : 'none' }} onSubmit={handleLogin}>
              <h2>Iniciar Sesión</h2>
              <input
                type="email"
                name="correo"
                placeholder="Correo institucional (@unac.edu.co)"
                value={formData.correo}
                onChange={handleChange}
                autoComplete="username"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* FORMULARIO REGISTRO */}
            <form className="formulario__register" style={{ display: !isLogin ? 'block' : 'none' }} onSubmit={handleRegister}>
              <h2>Regístrarse</h2>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                autoComplete="name"
                required
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo institucional (@unac.edu.co)"
                value={formData.correo}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                minLength={6}
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono o WhatsApp (opcional)"
                value={formData.telefono}
                onChange={handleChange}
                autoComplete="tel"
              />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" disabled={submitting}>
                {submitting ? 'Registrando...' : 'Regístrarse'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthPage;
