import { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Edit, Save, X, User, MapPin, Monitor } from "lucide-react";
import { toast } from "sonner";

export default function Catadores() {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  
  const queryClient = useQueryClient();

  // Opciones para los dropdowns
  const roles = ["Catador", "Experto", "Presidente", "Supervisor", "Invitado"];
  const mesas = Array.from({length: 20}, (_, i) => `Mesa ${i + 1}`);
  const puestos = Array.from({length: 8}, (_, i) => `Puesto ${i + 1}`);
  const tablets = Array.from({length: 50}, (_, i) => `Tablet ${String(i + 1).padStart(2, '0')}`);

  // Obtener catadores directamente desde Supabase
  const { data: catadores = [], isLoading, error } = useQuery({
    queryKey: ['catadores'],
    queryFn: async () => {
      try {
        console.log('🔍 Cargando catadores desde Supabase...');
        const { data, error } = await supabase
          .from('catadores')
          .select('*')
          .order('id');
        
        if (error) {
          console.error('❌ Error específico catadores:', error);
          throw error;
        }
        console.log('✅ Catadores cargados:', data?.length || 0);
        console.log('📋 Datos de catadores:', data);
        return data || [];
      } catch (err) {
        console.error('❌ Error cargando catadores:', err);
        throw err;
      }
    },
  });

  // Mutation para actualizar catador
  const updateCatadorMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      console.log('🔄 Actualizando catador en Supabase:', id, updates);
      const { data, error } = await supabase
        .from('catadores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ Catador actualizado:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['catadores']);
      toast.success('Catador actualizado correctamente');
      setEditingId(null);
      setEditData({});
    },
    onError: (error) => {
      toast.error(`Error al actualizar catador: ${error.message}`);
      console.error('❌ Error actualizando catador:', error);
    }
  });

  // Filtrar catadores
  const catadoresFiltrados = catadores.filter(catador => {
    if (!filtroTexto) return true;
    
    const busqueda = filtroTexto.toLowerCase();
    return (
      catador.codigo?.toLowerCase().includes(busqueda) ||
      catador.nombre?.toLowerCase().includes(busqueda) ||
      catador.email?.toLowerCase().includes(busqueda) ||
      catador.rol?.toLowerCase().includes(busqueda) ||
      catador.mesa?.toLowerCase().includes(busqueda) ||
      catador.puesto?.toLowerCase().includes(busqueda) ||
      catador.tablet?.toLowerCase().includes(busqueda)
    );
  });

  const handleEdit = (catador) => {
    setEditingId(catador.id);
    setEditData({
      rol: catador.rol,
      mesa: catador.mesa,
      puesto: catador.puesto,
      tablet: catador.tablet
    });
  };

  const handleSave = (id) => {
    updateCatadorMutation.mutate({ id, updates: editData });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSelectChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
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
        <h1 className="text-2xl font-bold mb-6 text-[#333951]">Gestión de Catadores</h1>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Error cargando catadores</p>
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
        <h1 className="text-3xl font-bold text-[#333951] mb-2">Gestión de Catadores</h1>
        <p className="text-gray-600">Administra la información de los catadores y sus asignaciones</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-[#333951]" />
            <p className="text-2xl font-bold text-[#333951]">{catadores.length}</p>
            <p className="text-sm text-gray-500">Total Catadores</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">
              {new Set(catadores.map(c => c.rol)).size}
            </p>
            <p className="text-sm text-gray-500">Roles</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">
              {new Set(catadores.map(c => c.mesa)).size}
            </p>
            <p className="text-sm text-gray-500">Mesas</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <Monitor className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-600">
              {new Set(catadores.map(c => c.tablet)).size}
            </p>
            <p className="text-sm text-gray-500">Tablets</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-none shadow-lg mb-6">
        <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-4">
          <CardTitle className="text-lg font-bold text-[#333951] flex items-center gap-2">
            <Search className="w-5 h-5" />
            Búsqueda de Catadores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <Input
                placeholder="Código, nombre, email, rol, mesa, puesto, tablet..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button
              onClick={() => setFiltroTexto("")}
              variant="outline"
            >
              Limpiar
            </Button>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {catadoresFiltrados.length} de {catadores.length} catadores
          </div>
        </CardContent>
      </Card>

      {/* Tabla de catadores */}
      <Card className="border-none shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-[#333951]/5 to-[#333951]/10 p-4">
          <CardTitle className="text-xl font-bold text-[#333951]">
            Listado de Catadores ({catadoresFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold">Código</TableHead>
                  <TableHead className="font-bold">Nombre</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Rol</TableHead>
                  <TableHead className="font-bold">Mesa</TableHead>
                  <TableHead className="font-bold">Puesto</TableHead>
                  <TableHead className="font-bold">Tablet</TableHead>
                  <TableHead className="font-bold w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catadoresFiltrados.map((catador) => (
                  <TableRow key={catador.id} className="hover:bg-[#333951]/5">
                    {/* Código */}
                    <TableCell className="font-mono font-bold text-[#333951]">
                      {catador.codigo}
                    </TableCell>
                    
                    {/* Nombre */}
                    <TableCell className="font-medium">
                      {catador.nombre}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-sm text-gray-600">
                      {catador.email}
                    </TableCell>

                    {/* Rol - Editable */}
                    <TableCell>
                      {editingId === catador.id ? (
                        <select
                          value={editData.rol || catador.rol}
                          onChange={(e) => handleSelectChange('rol', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#333951] focus:border-transparent"
                        >
                          {roles.map(rol => (
                            <option key={rol} value={rol}>{rol}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge className="bg-[#333951] text-white">
                          {catador.rol}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Mesa - Editable */}
                    <TableCell>
                      {editingId === catador.id ? (
                        <select
                          value={editData.mesa || catador.mesa}
                          onChange={(e) => handleSelectChange('mesa', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#333951] focus:border-transparent"
                        >
                          {mesas.map(mesa => (
                            <option key={mesa} value={mesa}>{mesa}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge variant="outline">
                          {catador.mesa}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Puesto - Editable */}
                    <TableCell>
                      {editingId === catador.id ? (
                        <select
                          value={editData.puesto || catador.puesto}
                          onChange={(e) => handleSelectChange('puesto', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#333951] focus:border-transparent"
                        >
                          {puestos.map(puesto => (
                            <option key={puesto} value={puesto}>{puesto}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {catador.puesto}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Tablet - Editable */}
                    <TableCell>
                      {editingId === catador.id ? (
                        <select
                          value={editData.tablet || catador.tablet}
                          onChange={(e) => handleSelectChange('tablet', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#333951] focus:border-transparent"
                        >
                          {tablets.map(tablet => (
                            <option key={tablet} value={tablet}>{tablet}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          {catador.tablet}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Acciones */}
                    <TableCell>
                      {editingId === catador.id ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleSave(catador.id)}
                            disabled={updateCatadorMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(catador)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {catadoresFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {filtroTexto 
                        ? "No se encontraron catadores con los filtros aplicados"
                        : "No hay catadores registrados"
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