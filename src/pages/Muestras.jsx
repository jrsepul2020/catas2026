import { useState } from "react";
import { supabaseServices } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wine, Search, Filter, Package, Building, MapPin, Calendar, Grape } from "lucide-react";


export default function Muestras() {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");

  // Obtener TODAS las muestras sin filtros
  const { data: muestras = [], isLoading, error } = useQuery({
    queryKey: ['muestras'],
    queryFn: async () => {
      try {
        console.log('🔍 Cargando muestras...');
        const result = await supabaseServices.entities.Vino.listAll();
        console.log('✅ Muestras cargadas:', result?.length || 0);
        return result || [];
      } catch (err) {
        console.error('❌ Error cargando muestras:', err);
        throw err;
      }
    },
  });

  // Filtrar muestras (con validación)
  const muestrasFiltradas = Array.isArray(muestras) ? muestras.filter(muestra => {
    if (!muestra) return false;
    
    const coincideTexto = !filtroTexto || 
      String(muestra.nombre || '').toLowerCase().includes(filtroTexto.toLowerCase()) ||
      String(muestra.codigo || '').includes(filtroTexto) ||
      String(muestra.empresa || '').toLowerCase().includes(filtroTexto.toLowerCase()) ||
      String(muestra.origen || '').toLowerCase().includes(filtroTexto.toLowerCase());

    const coincideCategoria = !filtroCategoria || muestra.categoria === filtroCategoria;

    const coincideEstado = filtroEstado === "todas" ||
      (filtroEstado === "activas" && muestra.activo) ||
      (filtroEstado === "inactivas" && !muestra.activo) ||
      (filtroEstado === "con-stock" && (muestra.existencias || 0) > 0) ||
      (filtroEstado === "sin-stock" && (muestra.existencias || 0) === 0);

    return coincideTexto && coincideCategoria && coincideEstado;
  }) : [];

  // Obtener categorías únicas para el filtro (con validación)
  const categorias = Array.isArray(muestras) ? 
    [...new Set(muestras.map(m => m?.categoria).filter(Boolean))].sort() : [];

  // Estadísticas (con validación)
  const stats = {
    total: Array.isArray(muestras) ? muestras.length : 0,
    activas: Array.isArray(muestras) ? muestras.filter(m => m?.activo).length : 0,
    conStock: Array.isArray(muestras) ? muestras.filter(m => (m?.existencias || 0) > 0).length : 0,
    totalStock: Array.isArray(muestras) ? muestras.reduce((sum, m) => sum + (m?.existencias || 0), 0) : 0,
    categorias: categorias.length,
    tandas: Array.isArray(muestras) ? new Set(muestras.map(m => m?.tanda).filter(Boolean)).size : 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333951]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#333951]">Gestión de Muestras</h1>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Error cargando muestras</p>
            <p className="text-sm">{error.message}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#333951] text-white rounded hover:bg-[#4a5576] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#333951] mb-2">Gestión de Muestras</h1>
        <p className="text-gray-600">Catálogo completo de muestras disponibles</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <Wine className="w-8 h-8 mx-auto mb-2 text-[#333951]" />
            <p className="text-2xl font-bold text-[#333951]">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{stats.activas}</p>
            <p className="text-sm text-gray-500">Activas</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-3 md:p-4 text-center">
            <Filter className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.conStock}</p>
            <p className="text-xs text-gray-600">Con Stock</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-3 md:p-4 text-center">
            <Building className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-lg md:text-2xl font-bold text-purple-600">{stats.totalStock}</p>
            <p className="text-xs text-gray-600">Stock Total</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-3 md:p-4 text-center">
            <Grape className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-[#BA4280]" />
            <p className="text-lg md:text-2xl font-bold text-[#BA4280]">{stats.categorias}</p>
            <p className="text-xs text-gray-600">Categorías</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-3 md:p-4 text-center">
            <Package className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-lg md:text-2xl font-bold text-orange-600">{stats.tandas}</p>
            <p className="text-xs text-gray-600">Tandas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-none shadow-lg mb-4 md:mb-6">
        <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-3 md:p-6">
          <CardTitle className="text-base md:text-lg font-bold text-[#333951] flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <Input
                placeholder="Nombre, código, empresa..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#333951] focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#333951] focus:border-transparent"
              >
                <option value="todas">Todas</option>
                <option value="activas">Solo activas</option>
                <option value="inactivas">Solo inactivas</option>
                <option value="con-stock">Con existencias</option>
                <option value="sin-stock">Sin existencias</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFiltroTexto("");
                  setFiltroCategoria("");
                  setFiltroEstado("todas");
                }}
                variant="outline"
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {muestrasFiltradas.length} de {muestras.length} muestras
          </div>
        </CardContent>
      </Card>

      {/* Tabla de muestras */}
      <Card className="border-none shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-3 md:p-6">
          <CardTitle className="text-base md:text-xl font-bold text-[#333951]">
            Listado de Muestras ({muestrasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-xs md:text-sm">ID/Código</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Información Básica</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Empresa/Productor</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Clasificación</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Procedencia</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Características Técnicas</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Stock/Inventario</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Fechas/Control</TableHead>
                  <TableHead className="font-bold text-xs md:text-sm">Estados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {muestrasFiltradas.map((muestra) => (
                  <TableRow key={muestra.id} className="hover:bg-[#E8DEC9]/30">
                    {/* ID/Código */}
                    <TableCell className="font-mono text-xs md:text-sm font-medium">
                      <div className="space-y-1">
                        <p className="font-bold text-[#333951]">ID: {muestra.id}</p>
                        <p className="font-bold">Código: {muestra.codigo}</p>
                        {muestra.codigotexto && muestra.codigotexto !== muestra.codigo && (
                          <p className="text-xs text-gray-500">Texto: {muestra.codigotexto}</p>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Información Básica */}
                    <TableCell className="text-xs md:text-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-[#333951]">{muestra.nombre}</p>
                        {muestra.año && (
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Año: {muestra.año}
                          </p>
                        )}
                        {muestra.tanda && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                            Tanda: {muestra.tanda}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Empresa/Productor */}
                    <TableCell className="text-xs md:text-sm">
                      <div className="space-y-1">
                        {muestra.empresa && (
                          <p className="text-xs font-medium flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {muestra.empresa}
                          </p>
                        )}
                        {muestra.ididempresa && (
                          <p className="text-xs text-gray-500">
                            ID Empresa: {muestra.ididempresa}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Clasificación */}
                    <TableCell className="text-xs md:text-sm">
                      <div className="space-y-1">
                        {muestra.categoria && (
                          <Badge variant="outline" className="text-xs block w-fit">
                            {muestra.categoria}
                          </Badge>
                        )}
                        {muestra.categoriadecata && (
                          <Badge variant="secondary" className="text-xs block w-fit">
                            Cata: {muestra.categoriadecata}
                          </Badge>
                        )}
                        {muestra.categoriaoiv && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs block w-fit">
                            OIV: {muestra.categoriaoiv}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Procedencia */}
                    <TableCell className="text-xs md:text-sm">
                      <div className="space-y-1">
                        {muestra.origen && (
                          <p className="flex items-center gap-1 text-xs">
                            <MapPin className="w-3 h-3" />
                            {muestra.origen}
                          </p>
                        )}
                        {muestra.pais && (
                          <p className="text-xs text-gray-600">🌍 {muestra.pais}</p>
                        )}
                        {muestra.igp && (
                          <p className="text-xs text-gray-500">IGP: {muestra.igp}</p>
                        )}
                      </div>
                    </TableCell>

                    {/* Características Técnicas */}
                    <TableCell className="text-xs md:text-sm">
                      <div className="space-y-1">
                        {muestra.grado && (
                          <p className="text-xs">🍷 {muestra.grado}% vol</p>
                        )}
                        {muestra.azucar && (
                          <p className="text-xs">🍯 {muestra.azucar} g/L azúcar</p>
                        )}
                        {muestra.tipouva && (
                          <p className="text-xs">🍇 {muestra.tipouva}</p>
                        )}
                        {muestra.tipoaceituna && (
                          <p className="text-xs">🫒 {muestra.tipoaceituna}</p>
                        )}
                        {muestra.destilado && (
                          <p className="text-xs">🥃 {muestra.destilado}</p>
                        )}
                      </div>
                    </TableCell>

                    {/* Stock/Inventario */}
                    <TableCell className="text-xs md:text-sm">
                      <div className="text-center space-y-1">
                        <p className={`text-lg font-bold ${
                          (muestra.existencias || 0) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {muestra.existencias || 0}
                        </p>
                        <p className="text-xs text-gray-500">unidades</p>
                      </div>
                    </TableCell>

                    {/* Fechas/Control */}
                    <TableCell className="text-xs md:text-sm">
                      <div className="space-y-1">
                        {muestra.fecha && (
                          <p className="text-xs">
                            📅 {new Date(muestra.fecha).toLocaleDateString('es-ES')}
                          </p>
                        )}
                        {muestra.creada && (
                          <p className="text-xs text-gray-500">
                            ⏰ {new Date(muestra.creada).toLocaleDateString('es-ES')}
                          </p>
                        )}
                        {muestra.created_at && muestra.created_at !== muestra.creada && (
                          <p className="text-xs text-gray-400">
                            📝 {new Date(muestra.created_at).toLocaleDateString('es-ES')}
                          </p>
                        )}
                        {muestra["modificada en"] && (
                          <p className="text-xs text-blue-600">
                            ✏️ {new Date(muestra["modificada en"]).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Estados */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          className={`text-xs w-fit ${
                            muestra.activo
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {muestra.activo ? 'Activa' : 'Inactiva'}
                        </Badge>
                        {muestra.pagada && (
                          <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200 w-fit">
                            Pagada ✓
                          </Badge>
                        )}
                        {muestra.manual && (
                          <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200 w-fit">
                            Manual ✏️
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {muestrasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {filtroTexto || filtroCategoria || filtroEstado !== "todas" 
                        ? "No se encontraron muestras con los filtros aplicados"
                        : "No hay muestras registradas"
                      }
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