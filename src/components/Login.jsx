import { useState } from "react";
import PropTypes from 'prop-types';
import { supabaseServices } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wine, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await supabaseServices.auth.signUp(email, password);
        toast.success("Cuenta creada exitosamente. Revisa tu email para confirmar.");
      } else {
        const user = await supabaseServices.auth.signIn(email, password);
        toast.success("¡Bienvenido a VIRTUS!");
        onLoginSuccess(user);
      }
    } catch (error) {
      const errorMsg = error?.message || "Error en la autenticación";
      toast.error(errorMsg);
      console.error("Error de autenticación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Para desarrollo: crear usuario demo automáticamente
      setEmail("demo@virtus.com");
      setPassword("demo123456");
      
      const user = await supabaseServices.auth.signIn("demo@virtus.com", "demo123456");
      toast.success("¡Sesión demo iniciada!");
      onLoginSuccess(user);
    } catch (error) {
      // Si no existe, intentar crearlo
      try {
        await supabaseServices.auth.signUp("demo@virtus.com", "demo123456");
        toast.info("Usuario demo creado. Inicia sesión nuevamente.");
      } catch (signUpError) {
        console.error("Error creando usuario demo:", signUpError);
        toast.error("Error creando usuario demo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#333951] to-[#4a5576] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <Wine className="w-10 h-10 text-[#333951]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VIRTUS</h1>
          <p className="text-gray-200">Sistema de Gestión de Catas</p>
        </div>

        {/* Formulario de login */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-[#333951]">
              {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#333951] hover:bg-[#4a5576] text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
                  </div>
                )}
              </Button>
            </form>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            {/* Botón demo */}
            <Button
              onClick={handleDemoLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full border-[#333951] text-[#333951] hover:bg-[#333951] hover:text-white"
            >
              <Wine className="w-4 h-4 mr-2" />
              Acceso Demo
            </Button>

            {/* Toggle entre login y signup */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-[#333951] hover:underline"
                disabled={isLoading}
              >
                {isSignUp 
                  ? "¿Ya tienes cuenta? Inicia sesión" 
                  : "¿No tienes cuenta? Regístrate"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-200 text-sm">
          <p>VIRTUS - Sistema Profesional de Catas</p>
          <p className="mt-1">Optimizado para tablets 1280x728px</p>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
};