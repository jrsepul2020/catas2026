import { useAuth } from "@/components/AuthProvider.jsx";
import Login from "@/pages/Login.jsx";

export default function ProtectedRoute({ children }) {
  const { catador, loading } = useAuth();

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333951] mx-auto"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay catador logueado, mostrar login
  if (!catador) {
    return <Login />;
  }

  // Si hay catador logueado, mostrar el contenido protegido
  return children;
}