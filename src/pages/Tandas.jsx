import { useState } from "react";
import { supabaseServices } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layers, Wine, Package, ChevronRight } from "lucide-react";

export default function Tandas() {
  const [tandaSeleccionada, setTandaSeleccionada] = useState(null);

  // Obtener todas las muestras para extraer tandas únicas
  const { data: muestras = [], isLoading } = useQuery({
    queryKey: ['muestras-todas'],
    queryFn: () => supabaseServices.entities.Vino.list('tanda'),
    initialData: []
  });

  // Obtener muestras de la tanda seleccionada
  const { data: muestrasTanda = [] } = useQuery({
    queryKey: ['muestras-tanda', tandaSeleccionada],
    queryFn: () => supabaseServices.entities.Vino.filter({ tanda: tandaSeleccionada }, 'codigo'),
    enabled: !!tandaSeleccionada,
    initialData: []
  });

  // Extraer tandas únicas y contar muestras por tanda
  const tandas = muestras.reduce((acc, muestra) => {
    const tanda = muestra.tanda || 'Sin tanda';
    if (!acc[tanda]) {
      acc[tanda] = {
        numero: tanda,
        total: 0,
        activas: 0,
        categorias: new Set()
      };
    }
    acc[tanda].total += 1;
    if (muestra.activo) acc[tanda].activas += 1;
    if (muestra.categoria) acc[tanda].categorias.add(muestra.categoria);
    return acc;
  }, {});

  const tandasArray = Object.values(tandas).map(tanda => ({
    ...tanda,
    categorias: Array.from(tanda.categorias)
  })).sort((a, b) => {
    // Ordenar: primero números, luego 'Sin tanda'
    if (a.numero === 'Sin tanda') return 1;
    if (b.numero === 'Sin tanda') return -1;
    return Number(a.numero) - Number(b.numero);
  });

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
        <h1 className="text-3xl font-bold text-[#333951] mb-2">Gestión de Tandas</h1>
        <p className="text-gray-600">Organización de muestras por tandas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Panel de Tandas */}
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-3 md:p-6">
            <CardTitle className="text-base md:text-xl font-bold text-[#333951] flex items-center gap-2">
              <Layers className="w-5 h-5 md:w-6 md:h-6" />
              Tandas Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="space-y-3">
              {tandasArray.map((tanda) => (
                <div
                  key={tanda.numero}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    tandaSeleccionada === tanda.numero
                      ? 'border-[#333951] bg-[#333951]/10'
                      : 'border-gray-200 hover:border-[#333951]/50'
                  }`}
                  onClick={() => setTandaSeleccionada(tanda.numero)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#333951] to-[#4a5576] rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#333951]">
                          Tanda {tanda.numero}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {tanda.total} muestras • {tanda.activas} activas
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-[#333951] transition-transform ${
                      tandaSeleccionada === tanda.numero ? 'rotate-90' : ''
                    }`} />
                  </div>
                  
                  {tanda.categorias.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tanda.categorias.map((categoria) => (
                        <Badge
                          key={categoria}
                          variant="secondary"
                          className="text-xs bg-[#333951]/10 text-[#333951] border-[#333951]/20"
                        >
                          {categoria}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panel de Muestras de la Tanda Seleccionada */}
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-3 md:p-6">
            <CardTitle className="text-base md:text-xl font-bold text-[#333951] flex items-center gap-2">
              <Wine className="w-5 h-5 md:w-6 md:h-6" />
              {tandaSeleccionada ? `Muestras de Tanda ${tandaSeleccionada}` : 'Selecciona una Tanda'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!tandaSeleccionada ? (
              <div className="p-6 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Selecciona una tanda para ver sus muestras</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold text-xs md:text-sm">Código</TableHead>
                      <TableHead className="font-bold text-xs md:text-sm">Nombre</TableHead>
                      <TableHead className="font-bold text-xs md:text-sm">Categoría</TableHead>
                      <TableHead className="font-bold text-xs md:text-sm">Estado</TableHead>
                      <TableHead className="font-bold text-xs md:text-sm">Existencias</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {muestrasTanda.map((muestra) => (
                      <TableRow key={muestra.id} className="hover:bg-[#333951]/10">
                        <TableCell className="font-mono text-xs md:text-sm font-medium">
                          {muestra.codigo}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm">
                          <div>
                            <p className="font-medium">{muestra.nombre}</p>
                            {muestra.empresa && (
                              <p className="text-xs text-gray-500">{muestra.empresa}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm">
                          {muestra.categoria && (
                            <Badge variant="outline" className="text-xs">
                              {muestra.categoria}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${
                              muestra.activo
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {muestra.activo ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm">
                          <span className={`font-medium ${
                            (muestra.existencias || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {muestra.existencias || 0}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {muestrasTanda.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                          No hay muestras en esta tanda
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de la tanda seleccionada */}
      {tandaSeleccionada && muestrasTanda.length > 0 && (
        <Card className="border-none shadow-lg mt-4 md:mt-6">
          <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-3 md:p-6">
            <CardTitle className="text-base md:text-lg font-bold text-[#333951]">
              Estadísticas - Tanda {tandaSeleccionada}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#958154]">{muestrasTanda.length}</p>
                <p className="text-sm text-gray-600">Total Muestras</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {muestrasTanda.filter(m => m.activo).length}
                </p>
                <p className="text-sm text-gray-600">Activas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {muestrasTanda.reduce((sum, m) => sum + (m.existencias || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Existencias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(muestrasTanda.map(m => m.categoria).filter(Boolean)).size}
                </p>
                <p className="text-sm text-gray-600">Categorías</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}