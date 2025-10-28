import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseServices } from '@/api/supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuario actual al cargar
    const checkUser = async () => {
      try {
        const currentUser = await supabaseServices.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error verificando usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listener para cambios de autenticación
    const { data: { subscription } } = supabaseServices.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Cambio de autenticación:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN') {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          setUser(session.user);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabaseServices.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signOut,
    signIn: async (email, password) => {
      const user = await supabaseServices.auth.signIn(email, password);
      setUser(user);
      return user;
    }
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