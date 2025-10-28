import { useAuth } from "@/hooks/useAuth.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wine, 
  User, 
  MapPin, 
  Monitor, 
  Clock, 
  CheckCircle, 
  Settings,
  LogOut,
  Coffee
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Welcome() {
  const { catador, signOut } = useAuth();

  if (!catador) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header de Bienvenida */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#333951] to-[#958154] rounded-2xl flex items-center justify-center shadow-lg">
              <Wine className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#333951]">¡Bienvenido, {catador.nombre}!</h1>
            <p className="text-lg text-gray-600">Sistema VIRTUS - Gestión de Catas</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">Sesión activa</span>
            </div>
          </div>
        </div>

        {/* Información del Catador */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#333951]/5 to-[#958154]/5">
            <CardTitle className="text-xl text-[#333951] flex items-center gap-2">
              <User className="w-6 h-6" />
              Tu Perfil de Catador
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#333951]/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-[#333951]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Código de Catador</p>
                    <p className="font-semibold text-[#333951]">{catador.codigo || 'No asignado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#958154]/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#958154]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rol</p>
                    <Badge variant="outline" className="bg-[#958154]/10 text-[#958154] border-[#958154]/20">
                      {catador.rol || 'Catador'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mesa Asignada</p>
                    <p className="font-semibold text-blue-600">
                      {catador.mesa_actual || catador.mesa || 'Sin asignar'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dispositivo</p>
                    <p className="font-semibold text-purple-600">
                      {catador.tablet || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Estado de Sesión</p>
                  <p className="text-sm text-green-600">
                    Último acceso: {catador.ultimo_login ? 
                      new Date(catador.ultimo_login).toLocaleString() : 
                      'Primera vez'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/Mesas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#333951]/20">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-[#333951]" />
                <h3 className="font-semibold text-[#333951] mb-2">Ver Mesas</h3>
                <p className="text-sm text-gray-600">Estado de ocupación en tiempo real</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/CatarVino">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#958154]/20">
              <CardContent className="p-6 text-center">
                <Wine className="w-12 h-12 mx-auto mb-3 text-[#958154]" />
                <h3 className="font-semibold text-[#958154] mb-2">Iniciar Cata</h3>
                <p className="text-sm text-gray-600">Comenzar evaluación de vinos</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/MisCatas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-300">
              <CardContent className="p-6 text-center">
                <Coffee className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-blue-600 mb-2">Mis Catas</h3>
                <p className="text-sm text-gray-600">Historial de evaluaciones</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="text-center pt-6">
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}