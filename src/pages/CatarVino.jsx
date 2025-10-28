
import { useState, useEffect } from "react";
import { supabaseServices } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wine, ArrowRight, X, RotateCcw, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CategoriasCata from "../components/cata/CategoriasCata";

export default function CatarVino() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vinos, setVinos] = useState([]);
  const [vinoActual, setVinoActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const [puntuaciones, setPuntuaciones] = useState({
    vista_limpidez: 0,
    vista_color: 0,
    olfato_limpidez: 0,
    olfato_intensidad: 0,
    olfato_calidad: 0,
    sabor_limpio: 0,
    sabor_intensidad: 0,
    sabor_persistencia: 0,
    sabor_calidad: 0,
    juicio_global: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const userData = await supabaseServices.auth.me();
      setUser(userData);
      
      const vinosData = await supabaseServices.entities.Vino.filter({ activo: true }, "orden");
      setVinos(vinosData);
      
      if (vinosData.length > 0) {
        setVinoActual(vinosData[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    return Object.values(puntuaciones).reduce((sum, val) => sum + val, 0);
  };

  const getCalificacion = (puntos) => {
    if (puntos >= 90) return { texto: "Excelente", color: "text-green-600" };
    if (puntos >= 80) return { texto: "Muy Bueno", color: "text-blue-600" };
    if (puntos >= 70) return { texto: "Bueno", color: "text-yellow-600" };
    if (puntos >= 60) return { texto: "Regular", color: "text-orange-600" };
    return { texto: "Insuficiente", color: "text-red-600" };
  };

  const handleReset = () => {
    setPuntuaciones({
      vista_limpidez: 0,
      vista_color: 0,
      olfato_limpidez: 0,
      olfato_intensidad: 0,
      olfato_calidad: 0,
      sabor_limpio: 0,
      sabor_intensidad: 0,
      sabor_persistencia: 0,
      sabor_calidad: 0,
      juicio_global: 0,
    });
  };

  const handleEnviar = async () => {
    if (!vinoActual) return;
    
    setGuardando(true);
    try {
      await supabaseServices.entities.Cata.create({
        vino_id: vinoActual.id, // Se mapeará a muestra_id automáticamente
        codigo_vino: vinoActual.codigo,
        catador_numero: Math.floor(Math.random() * 999) + 1,
        ...puntuaciones,
        puntos_totales: calcularTotal(),
        descartado: false,
        tanda: vinoActual.tanda || 1,
        orden: vinoActual.orden || 1,
        created_by: user?.id || user?.email || 'anonimo',
      });
      
      handleSiguienteVino();
    } catch (error) {
      console.error("Error guardando cata:", error);
    }
    setGuardando(false);
  };

  const handleDesechar = async () => {
    if (!vinoActual) return;
    
    setGuardando(true);
    try {
      await supabaseServices.entities.Cata.create({
        vino_id: vinoActual.id, // Se mapeará a muestra_id automáticamente
        codigo_vino: vinoActual.codigo,
        catador_numero: Math.floor(Math.random() * 999) + 1,
        ...puntuaciones,
        puntos_totales: 0,
        descartado: true,
        tanda: vinoActual.tanda || 1,
        orden: vinoActual.orden || 1,
        created_by: user?.id || user?.email || 'anonimo',
      });
      
      handleSiguienteVino();
    } catch (error) {
      console.error("Error descartando vino:", error);
    }
    setGuardando(false);
  };

  const handleSiguienteVino = () => {
    const indiceActual = vinos.findIndex(v => v.id === vinoActual?.id);
    if (indiceActual < vinos.length - 1) {
      setVinoActual(vinos[indiceActual + 1]);
      handleReset();
    } else {
      navigate(createPageUrl("MisCatas"));
    }
  };

  const puntosTotales = calcularTotal();
  const calificacion = getCalificacion(puntosTotales);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333951]"></div>
      </div>
    );
  }

  if (!vinoActual) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Wine className="w-16 h-16 mx-auto mb-4 text-[#333951]" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">No hay vinos disponibles</h2>
            <p className="text-gray-600 mb-6 text-sm">Agrega vinos para comenzar a catar</p>
            <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
              Ir al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-16px)] flex">
        {/* Panel principal de cata */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col mr-2">
          <div className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 px-3 py-2">
            <h2 className="text-base md:text-lg font-bold text-[#333951]">{vinoActual.nombre}</h2>
            <p className="text-xs text-[#333951]/70">Código: {vinoActual.codigo}</p>
          </div>
          
          <div className="p-2 flex-1 overflow-y-auto">
            <CategoriasCata 
              puntuaciones={puntuaciones} 
              setPuntuaciones={setPuntuaciones}
            />
          </div>
          
          {/* Botones de acción */}
          <div className="grid grid-cols-4 gap-2 p-2 border-t border-gray-200 bg-white">
            <Button
              onClick={handleSiguienteVino}
              className="bg-[#333951] hover:bg-[#4a5576] text-white h-10 text-xs font-semibold"
              disabled={guardando}
            >
              <ArrowRight className="w-4 h-4 mr-1" />
              Siguiente
            </Button>
            
            <Button
              onClick={handleDesechar}
              className="bg-[#333951] hover:bg-[#4a5576] text-white h-10 text-xs font-semibold"
              disabled={guardando}
            >
              <X className="w-4 h-4 mr-1" />
              Desechar
            </Button>
            
            <Button
              onClick={handleReset}
              className="bg-[#333951] hover:bg-[#4a5576] text-white h-10 text-xs font-semibold"
              disabled={guardando}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            
            <Button
              onClick={handleEnviar}
              className="bg-[#333951] hover:bg-[#4a5576] text-white h-10 text-xs font-semibold"
              disabled={guardando}
            >
              <Send className="w-4 h-4 mr-1" />
              ENVIAR
            </Button>
          </div>
        </div>

        {/* Panel lateral - visible en tablet */}
        <div className="w-56 space-y-2 flex-shrink-0">
          <div className="bg-white text-gray-900 rounded-lg p-4 shadow-lg border-2 border-gray-200">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Código</h3>
            <p className="text-4xl font-bold mb-3 text-black">{vinoActual.codigo}</p>
            
            <div className="pt-2 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Orden</span>
                <span className="font-bold text-black">{vinoActual.orden || 1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Catador</span>
                <span className="font-bold text-black">{Math.floor(Math.random() * 999) + 1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tanda</span>
                <span className="font-bold text-black">{vinoActual.tanda || 1}</span>
              </div>
            </div>
          </div>

          {/* Puntos totales - cuadro blanco con letra roja */}
          <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Puntos Totales</h3>
            <p className="text-6xl font-bold text-red-600">{puntosTotales}</p>
            <p className={`text-base font-semibold mt-2 ${calificacion.color}`}>
              {calificacion.texto}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow border border-gray-200">
            <h3 className="font-bold text-sm mb-2 text-[#333951]">Progreso</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vinos</span>
                <span className="font-bold">{vinos.findIndex(v => v.id === vinoActual.id) + 1} / {vinos.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#333951] to-[#4a5576] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((vinos.findIndex(v => v.id === vinoActual.id) + 1) / vinos.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
