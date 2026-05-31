/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CONTEXTO DE AUTENTICACIÓN                               ║
 * ║                                                                              ║
 * ║  Este archivo maneja el estado de autenticación en toda la aplicación.      ║
 * ║                                                                              ║
 * ║  CONCEPTOS CLAVE:                                                          ║
 * ║  - Context API: Forma de React para compartir datos sin "prop drilling" ║
 * ║  - Provider: Componente que provee datos a toda la app                  ║
 * ║  - Hook: Función especial de React para acceder a Context               ║
 * ║  - localStorage: Almacenamiento en el navegador para persistencia       ║
 * ║                                                                              ║
 * ║  ¿QUÉ HACE ESTE ARCHIVO?                                                  ║
 * ║  1. Mantiene información del usuario logueado (nombre, email, etc)      ║
 * ║  2. Guarda el token JWT en localStorage (para persistencia)              ║
 * ║  3. Verifica automáticamente si el token es válido al recargar           ║
 * ║  4. Provee funciones login/logout para toda la app                      ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/authApi';

// Creamos el Context - esto es como un "tubo" donde fluirán los datos de auth
const AuthContext = createContext(null);

/**
 * Clave para guardar el token JWT en localStorage.
 * localStorage es como una base de datos en el navegador.
 * Los datos persisten aunque el usuario cierre el navegador.
 */
const TOKEN_KEY = 'merkaunac_token';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                           AUTH PROVIDER                                     ║
 * ║                                                                              ║
 * ║  Este componente debe envolver toda la aplicación en main.jsx.              ║
 * ║  Una vez envuelto, cualquier componente puede usar useAuth() para         ║
 * ║  acceder a la información de autenticación.                                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */
export function AuthProvider({ children }) {
  // ─────────────────────────────────────────────────────────────────────────────
  // ESTADO DEL COMPONENTE
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * usuario: Guarda los datos del usuario logueado
   * - Si está logueado: { id, nombre, correo, telefono, wishlist }
   * - Si no: null
   */
  const [usuario, setUsuario] = useState(null);

  /**
   * token: El JWT del usuario para autenticación
   * Se guarda en localStorage para persistencia entre recargas
   */
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  /**
   * loading: Indica si está verificando la sesión
   * - true: Todavía está cargando (ej: verificando token al iniciar)
   * - false: Ya terminó de verificar
   */
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // EFECTO: Verificar sesión al iniciar la app
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * useEffect se ejecuta cuando el componente se "monta" (aparece en pantalla).
   *
   * Aquí verificamos si hay un token guardado y si todavía es válido.
   * Esto permite que el usuario no tenga que login cada vez que recarga.
   */
  useEffect(() => {
    let cancelado = false; // Bandera para evitar errores si el componente se desmonta

    (async () => {
      // 1. Buscar token en localStorage
      const storedToken = localStorage.getItem(TOKEN_KEY);

      // Si no hay token, no hay sesión que verificar
      if (!storedToken) {
        if (!cancelado) setLoading(false);
        return;
      }

      // 2. Hay token → verificar con el backend
      try {
        // fetchCurrentUser hace una petición GET /api/auth/me
        // que solo funciona si el token es válido
        const user = await fetchCurrentUser(storedToken);

        // Si el componente no se desmontó mientras tanto
        if (!cancelado) {
          setToken(storedToken);
          setUsuario(user);
        }
      } catch (error) {
        // Token inválido o expirado
        // Limpiamos todo
        if (!cancelado) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUsuario(null);
        }
      } finally {
        // Terminamos de cargar (haya sido exitoso o no)
        if (!cancelado) setLoading(false);
      }
    })();

    // Cleanup: si el componente se desmonta, marcamos para ignorar el resultado
    return () => { cancelado = true; };
  }, []); // Array vacío = solo se ejecuta al montar

  // ─────────────────────────────────────────────────────────────────────────────
  // FUNCIONES PARA MODIFICAR EL ESTADO
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * login: Inicia sesión
   *
   * Se llama desde AuthPage cuando el usuario hace login o registro exitoso.
   *
   * @param {string} jwtToken - El JWT que nos da el backend
   * @param {Object} userData - Datos del usuario { id, nombre, correo, telefono }
   */
  const login = useCallback((jwtToken, userData) => {
    // Guardar token en localStorage para persistencia
    localStorage.setItem(TOKEN_KEY, jwtToken);

    // Actualizar estado
    setToken(jwtToken);
    setUsuario(userData);
  }, []);

  /**
   * logout: Cierra sesión
   *
   * Se llama cuando el usuario presiona "Salir" en el TopBar.
   * También se llama automáticamente si el token expira.
   */
  const logout = useCallback(() => {
    // Eliminar token de localStorage
    localStorage.removeItem(TOKEN_KEY);

    // Limpiar estado
    setToken(null);
    setUsuario(null);
  }, []);

  /**
   * actualizarUsuario: Actualiza datos del usuario
   *
   * Útil cuando el usuario cambia algo de su perfil.
   * Solo actualiza los campos que se pasen, mantiene los demás.
   *
   * @param {Object} nuevosDatos - Campos a actualizar
   * @example actualizarUsuario({ telefono: '3001234567' })
   */
  const actualizarUsuario = useCallback((nuevosDatos) => {
    setUsuario(prev => (prev ? { ...prev, ...nuevosDatos } : null));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // VALOR DEL CONTEXT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * value: El objeto que将通过 Context 被所有组件访问
   * Contiene todo lo que necesita cualquier componente para saber si está logueado.
   */
  const value = {
    usuario,        // Datos del usuario o null
    token,          // JWT o null
    loading,        // boolean de carga
    login,          // Función para login
    logout,         // Función para logout
    actualizarUsuario, // Función para actualizar datos
    isAuthenticated: !!usuario, // true si hay usuario logueado
  };

  // Proveer el contexto a todos los hijos (children)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                              HOOK useAuth                                    ║
 * ║                                                                              ║
 * ║  Este es el "gancho" que los componentes usan para acceder a auth.          ║
 * ║                                                                              ║
 * ║  ¿CÓMO USARLO?                                                             ║
 * ║                                                                              ║
 * ║  ```jsx                                                                     ║
 * ║  import { useAuth } from '../contexts/AuthContext';                         ║
 * ║                                                                              ║
 * ║  function MiComponente() {                                                  ║
 * ║    const { usuario, isAuthenticated, logout } = useAuth();                  ║
 * ║                                                                              ║
 * ║    if (!isAuthenticated) return <p>No logueado</p>;                        ║
 * ║    return (                                                                  ║
 * ║      <div>                                                                  ║
 * ║        Hola {usuario.nombre}!                                               ║
 * ║        <button onClick={logout}>Salir</button>                             ║
 * ║      </div>                                                                 ║
 * ║    );                                                                       ║
 * ║  }                                                                          ║
 * ║  ```                                                                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * @returns {Object} { usuario, token, loading, login, logout, isAuthenticated }
 * @throws {Error} Si se usa fuera de AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  // Si se usa fuera del provider, es un error de uso
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}

// Export default para imports simples
export default AuthContext;
