
import { supabaseServices } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wine, TrendingUp, Award, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function MisCatas() {
  // Tu tabla catas no maneja usuarios individuales, así que no necesitamos este estado

  const { data: catas, isLoading } = useQuery({
    queryKey: ['catas'],
    queryFn: () => supabaseServices.entities.Cata.filter({}, "-timestamp"),
    initialData: [],
    enabled: true // No depende del usuario ya que tu tabla no tiene ese campo
  });

  const { data: vinos } = useQuery({
    queryKey: ['vinos'],
    queryFn: () => supabaseServices.entities.Vino.list(),
    initialData: []
  });

  const getVinoNombre = (cata) => {
    // Tu tabla catas no tiene relación directa con muestras
    // Buscar por codigotexto en la lista de vinos/muestras
    const vino = vinos.find(v => 
      v.codigo === cata.codigo_vino || 
      v.codigotexto === cata.codigotexto ||
      v.codigo?.toString() === cata.codigo_vino
    );
    return vino?.nombre || `Muestra ${cata.codigo_vino || cata.codigotexto || 'Desconocida'}`;
  };

  const getCalificacion = (puntos) => {
    if (puntos >= 90) return { texto: "Excelente", color: "bg-green-100 text-green-800" };
    if (puntos >= 80) return { texto: "Muy Bueno", color: "bg-blue-100 text-blue-800" };
    if (puntos >= 70) return { texto: "Bueno", color: "bg-yellow-100 text-yellow-800" };
    if (puntos >= 60) return { texto: "Regular", color: "bg-orange-100 text-orange-800" };
    return { texto: "Insuficiente", color: "bg-red-100 text-red-800" };
  };

  const promedioPuntos = catas.length > 0
    ? (catas.reduce((sum, c) => sum + (c.descartado ? 0 : c.puntos_totales), 0) / catas.filter(c => !c.descartado).length).toFixed(1)
    : 0;

  const totalCatas = catas.filter(c => !c.descartado).length;
  const totalDescartados = catas.filter(c => c.descartado).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333951]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333951] mb-2">Mis Catas</h1>
        <p className="text-gray-600">Historial completo de evaluaciones</p>
      </div>

      {/* Estadísticas - responsivas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#333951]/10 rounded-xl">
                <Wine className="w-8 h-8 text-[#333951]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Catas</p>
                <p className="text-2xl font-bold text-[#333951]">{totalCatas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#333951]/10 rounded-xl">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Promedio</p>
                <p className="text-2xl font-bold text-blue-900">{promedioPuntos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <Award className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Descartados</p>
                <p className="text-2xl font-bold text-red-900">{totalDescartados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de catas - responsiva */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-4">
          <CardTitle className="text-xl font-bold text-[#333951]">Historial de Catas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
                            <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-sm">Fecha</TableHead>
                  <TableHead className="font-bold text-sm hidden sm:table-cell">Vino</TableHead>
                  <TableHead className="font-bold text-sm">Código</TableHead>
                  <TableHead className="font-bold text-sm">Puntos</TableHead>
                  <TableHead className="font-bold text-sm hidden md:table-cell">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catas.map((cata) => {
                  const calificacion = getCalificacion(cata.puntos_totales);
                  return (
                    <TableRow key={cata.id} className="hover:bg-[#333951]/10 transition-colors">
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 hidden sm:block" />
                          <span className="hidden md:inline">
                            {format(new Date(cata.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                          </span>
                          <span className="md:hidden">
                            {format(new Date(cata.created_at), "dd/MM", { locale: es })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-xs md:text-sm hidden sm:table-cell">
                        <span className="line-clamp-1">{getVinoNombre(cata)}</span>
                      </TableCell>
                      <TableCell className="font-mono text-xs md:text-sm">
                        {cata.codigo_vino}
                      </TableCell>
                      <TableCell>
                        <span className="text-lg md:text-2xl font-bold text-[#333951]">
                          {cata.puntos_totales}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={`${calificacion.color} border-0 text-xs`}>
                          {calificacion.texto}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cata.descartado ? (
                          <Badge variant="destructive" className="text-xs">Desc.</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 border-0 text-xs">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {catas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 md:py-8 text-gray-500 text-xs md:text-sm">
                      No hay catas registradas todavía
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
