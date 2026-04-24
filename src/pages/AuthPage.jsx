import { useEffect, useState } from 'react';
import '../styles/auth.css';

/**
 * Pantalla visual de login/registro (solo maquetación por ahora).
 *
 * @returns {JSX.Element} Vista de autenticación con animación entre formularios.
 */
function AuthPage() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 850);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    /**
     * Ajusta la bandera de escritorio cuando cambia el ancho de ventana.
     *
     * @returns {void}
     */
    const onResize = () => setIsDesktop(window.innerWidth > 850);

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="auth-page">
      <main>
        <div className="contenedor__todo">
          <div className="caja__trasera">
            <div className="caja__trasera-login" style={{ display: isDesktop || !isLogin ? 'block' : 'none', opacity: isDesktop ? (isLogin ? 0 : 1) : 1 }}>
              <h3>¿Ya tienes una cuenta?</h3>
              <p>Inicia sesión para entrar en la página</p>
              <button type="button" onClick={() => setIsLogin(true)}>Iniciar Sesión</button>
            </div>
            <div className="caja__trasera-register" style={{ display: 'block', opacity: isDesktop ? (isLogin ? 1 : 0) : isLogin ? 1 : 0 }}>
              <h3>¿Aún no tienes una cuenta?</h3>
              <p>Regístrate para que puedas iniciar sesión</p>
              <button type="button" onClick={() => setIsLogin(false)}>Regístrarse</button>
            </div>
          </div>
          <div className="contenedor__login-register" style={{ left: isDesktop ? (isLogin ? '10px' : '410px') : '0px' }}>
            <form className="formulario__login" style={{ display: isLogin ? 'block' : 'none' }}>
              <h2>Iniciar Sesión</h2>
              <input type="text" placeholder="Correo electrónico" autoComplete="username" />
              <input type="password" placeholder="Contraseña" autoComplete="current-password" />
              <button type="button">Entrar</button>
            </form>
            <form className="formulario__register" style={{ display: !isLogin ? 'block' : 'none' }}>
              <h2>Regístrarse</h2>
              <input type="text" placeholder="Nombre completo" autoComplete="name" />
              <input type="email" placeholder="Correo electrónico" autoComplete="email" />
              <input type="text" placeholder="Usuario" autoComplete="username" />
              <input type="password" placeholder="Contraseña" autoComplete="new-password" />
              <button type="button">Regístrarse</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthPage;
