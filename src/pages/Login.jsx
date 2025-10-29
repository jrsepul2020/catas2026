import { useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, User, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log('🔐 Intentando login con:', { email });
      
      const result = await signIn(email, password);
      
      if (result.success) {
        console.log('✅ Login exitoso:', result.catador);
        // El AuthProvider se encargará de redirigir
      } else {
        console.error('❌ Login fallido:', result.error);
        setError(result.error || "Error de autenticación");
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para llenar credenciales de prueba
  const fillTestCredentials = () => {
    setEmail("juan@catas.com");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#333951]/10 via-gray-50 to-[#958154]/10 p-4 overflow-y-auto">
      <div className="w-full max-w-md mx-auto space-y-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <div>
            <h1 className="text-4xl font-bold text-[#333951]">International Awards Virtus</h1>
            <p className="text-xl text-gray-600 mt-2">Sistema de Catas</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl font-bold text-[#333951] text-center flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </CardTitle>
            <p className="text-sm text-gray-500 text-center">
              Ingresa tus credenciales de catador
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#333951]">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu-email@catas.com"
                    className="pl-10 h-12 border-gray-200 focus:border-[#333951] focus:ring-[#333951]"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#333951]">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="pl-10 h-12 border-gray-200 focus:border-[#333951] focus:ring-[#333951]"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#333951] hover:bg-[#333951]/90 text-white font-semibold transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            {/* Test Credentials */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                type="button"
                variant="outline"
                onClick={fillTestCredentials}
                className="w-full text-[#958154] border-[#958154]/30 hover:bg-[#958154]/5"
                disabled={isLoading}
              >
                <User className="w-4 h-4 mr-2" />
                Usar credenciales de prueba
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                juan@catas.com / password123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 International Awards Virtus - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}