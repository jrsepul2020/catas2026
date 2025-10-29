import { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wine, Search, Filter, Package, Building, Grape } from "lucide-react";


export default function Muestras() {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");

  // Obtener TODAS las muestras directamente desde Supabase
  const { data: muestras = [], isLoading, error } = useQuery({
    queryKey: ['muestras'],
    queryFn: async () => {
      try {
        console.log('🔍 Cargando muestras desde Supabase...');
        
        // Primero intentar obtener información de la tabla
        const { count, error: countError } = await supabase
          .from('muestras')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error('❌ Error contando muestras:', countError);
        } else {
          console.log('📊 Total de muestras en la tabla:', count);
        }
        
        // Obtener los datos con relación directa a empresas mediante empresa_id
        // Usar el nombre exacto del constraint: fk_muestras_empresa
        let data, error;
        
        // Opción 1: Usando el constraint name
        const result1 = await supabase
          .from('muestras')
          .select('*, empresas!fk_muestras_empresa(id, nombre)')
          .order('id');
        
        if (result1.error) {
          console.log('⚠️ Constraint name falló, intentando con empresa_id...');
          
          // Opción 2: Intentar con nombre de columna
          const result2 = await supabase
            .from('muestras')
            .select('*, empresas:empresa_id(id, nombre)')
            .order('id');
          
          if (result2.error) {
            console.log('⚠️ Sintaxis empresa_id falló, intentando sin alias...');
            
            // Opción 3: Sin especificar la relación
            const result3 = await supabase
              .from('muestras')
              .select('*, empresas(id, nombre)')
              .order('id');
            
            if (result3.error) {
              console.log('⚠️ Todas las sintaxis fallaron, cargando sin relación...');
              data = null;
              error = result3.error;
            } else {
              data = result3.data;
              error = null;
              console.log('✅ Sintaxis 3 (sin alias) funcionó');
            }
          } else {
            data = result2.data;
            error = null;
            console.log('✅ Sintaxis 2 (empresa_id) funcionó');
          }
        } else {
          data = result1.data;
          error = null;
          console.log('✅ Sintaxis 1 (constraint name) funcionó');
        }
        
        if (error) {
          console.error('❌ Error específico en query con relación:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          
          // Si falla por la relación, intentar sin ella
          console.log('⚠️ La columna empresa_id podría no existir. Intentando cargar sin relación empresas...');
          const { data: dataSimple, error: errorSimple } = await supabase
            .from('muestras')
            .select('*')
            .order('id');
          
          if (errorSimple) {
            console.error('❌ Error en consulta simple:', {
              message: errorSimple.message,
              details: errorSimple.details,
              hint: errorSimple.hint,
              code: errorSimple.code
            });
            throw errorSimple;
          }
          
          console.log('✅ Muestras cargadas sin relación:', dataSimple?.length || 0);
          if (dataSimple && dataSimple.length > 0) {
            console.log('📋 Columnas disponibles en muestras:', Object.keys(dataSimple[0]));
          }
          return dataSimple || [];
        }
        
        console.log('✅ Muestras cargadas exitosamente:', data?.length || 0);
        console.log('📋 Primeras 3 muestras:', data?.slice(0, 3));
        console.log('📋 Estructura de primera muestra:', data?.[0] ? Object.keys(data[0]) : 'No hay datos');
        
        return data || [];
      } catch (err) {
        console.error('❌ Error cargando muestras:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 30000, // 30 segundos
  });

  // Filtrar muestras (con validación)
  const muestrasFiltradas = Array.isArray(muestras) ? muestras.filter(muestra => {
    if (!muestra) return false;
    
    // Obtener nombre de empresa desde la relación directa
    const empresaNombre = muestra.empresas?.nombre || '';
    
    const coincideTexto = !filtroTexto || 
      String(muestra.nombre || '').toLowerCase().includes(filtroTexto.toLowerCase()) ||
      String(muestra.codigo || '').includes(filtroTexto) ||
      String(empresaNombre).toLowerCase().includes(filtroTexto.toLowerCase()) ||
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333951] mx-auto"></div>
          <p className="text-gray-600">Cargando muestras desde Supabase...</p>
          <p className="text-sm text-gray-500">Abre la consola (F12) para ver detalles</p>
        </div>
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
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-left max-w-md mx-auto">
              <p className="text-xs text-red-700 font-mono break-words">
                {JSON.stringify(error, null, 2)}
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#333951] text-white rounded hover:bg-[#4a5576] transition-colors"
          >
            Reintentar
          </button>
          <p className="text-sm text-gray-500 mt-2">Revisa la consola (F12) para más detalles</p>
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

      {/* Tabla de muestras - Vista simplificada para cata */}
      <Card className="border-none shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-3 md:p-6">
          <CardTitle className="text-base md:text-xl font-bold text-[#333951]">
            Muestras para Cata ({muestrasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-sm md:text-base">Código Texto</TableHead>
                  <TableHead className="font-bold text-sm md:text-base">Nombre</TableHead>
                  <TableHead className="font-bold text-sm md:text-base">Categoría</TableHead>
                  <TableHead className="font-bold text-sm md:text-base">Categoría de Cata</TableHead>
                  <TableHead className="font-bold text-sm md:text-base">Tanda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {muestrasFiltradas.map((muestra) => (
                  <TableRow key={muestra.id} className="hover:bg-[#333951]/5">
                    {/* Código */}
                    <TableCell className="font-mono text-sm md:text-base font-bold text-[#333951]">
                      {muestra.codigo || '-'}
                    </TableCell>
                    
                    {/* Nombre */}
                    <TableCell className="text-sm md:text-base font-medium">
                      {muestra.nombre || '-'}
                    </TableCell>

                    {/* Categoría */}
                    <TableCell className="text-sm md:text-base">
                      {muestra.categoria ? (
                        <Badge variant="outline" className="text-sm">
                          {muestra.categoria}
                        </Badge>
                      ) : '-'}
                    </TableCell>

                    {/* Categoría de Cata */}
                    <TableCell className="text-sm md:text-base">
                      {muestra.categoriadecata ? (
                        <Badge className="bg-[#333951] text-white text-sm">
                          {muestra.categoriadecata}
                        </Badge>
                      ) : '-'}
                    </TableCell>

                    {/* Tanda */}
                    <TableCell className="text-sm md:text-base">
                      {muestra.tanda ? (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm">
                          {muestra.tanda}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {muestrasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="space-y-2">
                        <p className="text-gray-500">
                          {filtroTexto || filtroCategoria || filtroEstado !== "todas" 
                            ? "No se encontraron muestras con los filtros aplicados"
                            : "No hay muestras registradas"
                          }
                        </p>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Total en base de datos: {muestras.length}</p>
                          <p>Filtros activos: {filtroTexto ? `Texto: "${filtroTexto}"` : ''} {filtroCategoria ? `Categoría: "${filtroCategoria}"` : ''} Estado: {filtroEstado}</p>
                          <p className="font-mono">Abre la consola (F12) para ver logs detallados</p>
                        </div>
                      </div>
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