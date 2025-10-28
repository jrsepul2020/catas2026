import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseServices } from '@/api/supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [catador, setCatador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar catador logueado al cargar
    const checkCatador = async () => {
      try {
        console.log('🔍 Verificando sesión de catador...');
        const sessionId = localStorage.getItem('catador_session');
        
        if (sessionId) {
          console.log('📱 Session ID encontrado:', sessionId);
          const loggedCatador = await supabaseServices.entities.Catador.getBySession(sessionId);
          
          if (loggedCatador) {
            console.log('✅ Catador autenticado:', loggedCatador.nombre);
            setCatador(loggedCatador);
            setIsAuthenticated(true);
          } else {
            console.log('❌ Sesión inválida, limpiando...');
            localStorage.removeItem('catador_session');
            setCatador(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('📭 No hay sesión guardada');
          setCatador(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Error verificando catador:', error);
        localStorage.removeItem('catador_session');
        setCatador(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkCatador();
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔐 AuthProvider: Intentando login para:', email);
      
      const result = await supabaseServices.entities.Catador.signIn(email, password);
      
      if (result.success) {
        console.log('✅ AuthProvider: Login exitoso:', result.catador.nombre);
        setCatador(result.catador);
        setIsAuthenticated(true);
        localStorage.setItem('catador_session', result.session_id);
        
        return {
          success: true,
          catador: result.catador,
          message: 'Login exitoso'
        };
      } else {
        console.log('❌ AuthProvider: Login fallido:', result.message);
        return {
          success: false,
          error: result.message || 'Credenciales incorrectas'
        };
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error en login:', error);
      return {
        success: false,
        error: error.message || 'Error de conexión'
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 AuthProvider: Cerrando sesión...');
      
      if (catador) {
        await supabaseServices.entities.Catador.signOut(catador.id);
      }
      
      localStorage.removeItem('catador_session');
      setCatador(null);
      setIsAuthenticated(false);
      
      console.log('✅ AuthProvider: Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      // Aún así limpiamos la sesión local
      localStorage.removeItem('catador_session');
      setCatador(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user: catador, // Mantenemos 'user' para compatibilidad con componentes existentes
    catador,
    loading,
    isAuthenticated,
    signOut,
    signIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthProvider;