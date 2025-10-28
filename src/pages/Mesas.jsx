import { useState } from "react";
import { supabaseServices } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, MapPin, Monitor, Clock, AlertCircle, CheckCircle, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider.jsx";

export default function Mesas() {
  const [vista, setVista] = useState("grid"); // grid o table
  const { catador } = useAuth();
  
  // Obtener catadores logueados
  const { data: catadoresLogueados = [], isLoading: loadingCatadores, refetch: refetchCatadores } = useQuery({
    queryKey: ['catadores-logueados'],
    queryFn: async () => {
      try {
        console.log('🔍 Cargando catadores logueados...');
        const result = await supabaseServices.entities.Catador.getLoggedCatadores();
        console.log('✅ Catadores logueados:', result?.length || 0);
        return result || [];
      } catch (err) {
        console.error('❌ Error cargando catadores logueados:', err);
        return [];
      }
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  // Agrupar catadores por mesa
  const mesasOcupadas = catadoresLogueados.reduce((acc, catador) => {
    const mesa = catador.mesa_actual || catador.mesa || 'Sin Mesa';
    if (!acc[mesa]) {
      acc[mesa] = [];
    }
    acc[mesa].push(catador);
    return acc;
  }, {});

  // Crear array de todas las mesas (ocupadas y vacías)
  const todasLasMesas = [];
  for (let i = 1; i <= 10; i++) {
    const mesaNum = `Mesa ${i}`;
    todasLasMesas.push({
      numero: mesaNum,
      catadores: mesasOcupadas[mesaNum] || [],
      ocupada: (mesasOcupadas[mesaNum] || []).length > 0,
      capacidad: 4
    });
  }

  // Estadísticas
  const stats = {
    totalCatadores: catadoresLogueados.length,
    mesasOcupadas: Object.keys(mesasOcupadas).filter(mesa => mesa !== 'Sin Mesa').length,
    mesasDisponibles: 10 - Object.keys(mesasOcupadas).filter(mesa => mesa !== 'Sin Mesa').length,
    catadoresSinMesa: mesasOcupadas['Sin Mesa']?.length || 0
  };

  const getMesaStatus = (mesa) => {
    if (mesa.catadores.length === 0) return 'vacía';
    if (mesa.catadores.length < mesa.capacidad) return 'parcial';
    if (mesa.catadores.length === mesa.capacidad) return 'completa';
    return 'sobrecargada';
  };

  const getMesaColor = (status) => {
    switch (status) {
      case 'vacía': return 'bg-gray-100 border-gray-300';
      case 'parcial': return 'bg-yellow-50 border-yellow-300';
      case 'completa': return 'bg-green-50 border-green-300';
      case 'sobrecargada': return 'bg-red-50 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getMesaBadgeColor = (status) => {
    switch (status) {
      case 'vacía': return 'bg-gray-100 text-gray-800';
      case 'parcial': return 'bg-yellow-100 text-yellow-800';
      case 'completa': return 'bg-green-100 text-green-800';
      case 'sobrecargada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingCatadores) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333951]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333951] mb-2">Control de Mesas</h1>
        <p className="text-gray-600">Estado en tiempo real de ocupación de mesas</p>
        {catador && (
          <p className="text-sm text-[#333951] mt-2">
            Bienvenido, <strong>{catador.nombre}</strong> - Mesa asignada: <strong>{catador.mesa || 'Sin asignar'}</strong>
          </p>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-[#333951]" />
            <p className="text-2xl font-bold text-[#333951]">{stats.totalCatadores}</p>
            <p className="text-sm text-gray-500">Catadores Activos</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{stats.mesasOcupadas}</p>
            <p className="text-sm text-gray-500">Mesas Ocupadas</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{stats.mesasDisponibles}</p>
            <p className="text-sm text-gray-500">Mesas Libres</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-orange-600">{stats.catadoresSinMesa}</p>
            <p className="text-sm text-gray-500">Sin Mesa</p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setVista("grid")}
          variant={vista === "grid" ? "default" : "outline"}
          className={vista === "grid" ? "bg-[#333951] text-white" : ""}
        >
          Vista de Mesas
        </Button>
        <Button
          onClick={() => setVista("table")}
          variant={vista === "table" ? "default" : "outline"}
          className={vista === "table" ? "bg-[#333951] text-white" : ""}
        >
          Vista de Tabla
        </Button>
        <Button
          onClick={() => refetchCatadores()}
          variant="outline"
        >
          <Clock className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {vista === "grid" ? (
        /* Vista de Grid - Mesas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {todasLasMesas.map((mesa) => {
            const status = getMesaStatus(mesa);
            return (
              <Card 
                key={mesa.numero} 
                className={`border-2 ${getMesaColor(status)} hover:shadow-lg transition-shadow`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-[#333951]">
                      {mesa.numero}
                    </CardTitle>
                    <Badge className={getMesaBadgeColor(status)}>
                      {mesa.catadores.length}/{mesa.capacidad}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {mesa.catadores.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Mesa Vacía</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mesa.catadores.map((catador) => (
                        <div 
                          key={catador.id} 
                          className="flex items-center gap-2 p-2 bg-white rounded border"
                        >
                          <User className="w-4 h-4 text-[#333951]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#333951] truncate">
                              {catador.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {catador.codigo} - {catador.rol}
                            </p>
                          </div>
                          {catador.tablet && (
                            <Monitor className="w-3 h-3 text-blue-500" title={catador.tablet} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Vista de Tabla */
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-4">
            <CardTitle className="text-xl font-bold text-[#333951]">
              Estado Detallado de Mesas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">Mesa</TableHead>
                    <TableHead className="font-bold">Estado</TableHead>
                    <TableHead className="font-bold">Ocupación</TableHead>
                    <TableHead className="font-bold">Catadores</TableHead>
                    <TableHead className="font-bold">Tablets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todasLasMesas.map((mesa) => {
                    const status = getMesaStatus(mesa);
                    return (
                      <TableRow key={mesa.numero} className="hover:bg-[#333951]/5">
                        <TableCell className="font-bold text-[#333951]">
                          {mesa.numero}
                        </TableCell>
                        <TableCell>
                          <Badge className={getMesaBadgeColor(status)}>
                            {status === 'vacía' && 'Vacía'}
                            {status === 'parcial' && 'Parcial'}
                            {status === 'completa' && 'Completa'}
                            {status === 'sobrecargada' && 'Sobrecargada'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">
                              {mesa.catadores.length}/{mesa.capacidad}
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  status === 'completa' ? 'bg-green-500' :
                                  status === 'parcial' ? 'bg-yellow-500' :
                                  status === 'sobrecargada' ? 'bg-red-500' : 'bg-gray-300'
                                }`}
                                style={{ width: `${Math.min((mesa.catadores.length / mesa.capacidad) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {mesa.catadores.length === 0 ? (
                            <span className="text-gray-500">-</span>
                          ) : (
                            <div className="space-y-1">
                              {mesa.catadores.map((catador) => (
                                <div key={catador.id} className="text-sm">
                                  <span className="font-medium">{catador.nombre}</span>
                                  <span className="text-gray-500 ml-2">({catador.rol})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {mesa.catadores.length === 0 ? (
                            <span className="text-gray-500">-</span>
                          ) : (
                            <div className="space-y-1">
                              {mesa.catadores.map((catador) => (
                                <div key={catador.id} className="text-sm text-blue-600">
                                  {catador.tablet || 'Sin tablet'}
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Catadores sin mesa asignada */}
      {stats.catadoresSinMesa > 0 && (
        <Card className="border-none shadow-lg mt-6 border-l-4 border-orange-500">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-lg font-bold text-orange-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Catadores Sin Mesa Asignada ({stats.catadoresSinMesa})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mesasOcupadas['Sin Mesa']?.map((catador) => (
                <div key={catador.id} className="flex items-center gap-3 p-3 bg-white rounded border">
                  <User className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">{catador.nombre}</p>
                    <p className="text-sm text-gray-600">{catador.codigo} - {catador.rol}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}