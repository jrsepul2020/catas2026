import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../api/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, Plus, Trash2, Edit, Wine, Mail, Phone, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Empresas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    cif: '',
    contacto: ''
  });
  const [selectedMuestras, setSelectedMuestras] = useState([]);
  const queryClient = useQueryClient();

  // Obtener empresas
  const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      console.log('📊 Cargando empresas...');
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error cargando empresas:', error);
        throw error;
      }

      console.log('✅ Empresas cargadas:', data?.length || 0);
      return data || [];
    }
  });

  // Obtener muestras disponibles
  const { data: muestras = [], isLoading: loadingMuestras } = useQuery({
    queryKey: ['muestras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('muestras')
        .select('*')
        .order('codigo', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Obtener relación empresas-muestras
  const { data: empresaMuestras = [] } = useQuery({
    queryKey: ['empresa_muestras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresa_muestras')
        .select('*');

      if (error) {
        console.log('⚠️ Tabla empresa_muestras no existe o no es accesible');
        return [];
      }
      return data || [];
    },
    retry: false
  });

  // Crear/Actualizar empresa
  const empresaMutation = useMutation({
    mutationFn: async (empresaData) => {
      if (editingEmpresa) {
        // Actualizar
        const { data, error } = await supabase
          .from('empresas')
          .update(empresaData)
          .eq('id', editingEmpresa.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Crear
        const { data, error } = await supabase
          .from('empresas')
          .insert([empresaData])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: async (empresa) => {
      // Asignar muestras si hay seleccionadas
      if (selectedMuestras.length > 0) {
        try {
          // Primero, eliminar asignaciones anteriores si es edición
          if (editingEmpresa) {
            await supabase
              .from('empresa_muestras')
              .delete()
              .eq('empresa_id', empresa.id);
          }

          // Crear nuevas asignaciones
          const asignaciones = selectedMuestras.map(muestraId => ({
            empresa_id: empresa.id,
            muestra_id: muestraId
          }));

          const { error: asignError } = await supabase
            .from('empresa_muestras')
            .insert(asignaciones);

          if (asignError) {
            console.log('⚠️ Error asignando muestras:', asignError.message);
            toast.warning('Empresa guardada pero no se pudieron asignar las muestras');
          }
        } catch (err) {
          console.log('⚠️ No se pudo crear relación con muestras:', err.message);
        }
      }

      queryClient.invalidateQueries(['empresas']);
      queryClient.invalidateQueries(['empresa_muestras']);
      toast.success(editingEmpresa ? 'Empresa actualizada correctamente' : 'Empresa creada correctamente');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      console.error('❌ Error guardando empresa:', error);
    }
  });

  // Eliminar empresa
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Primero eliminar relaciones con muestras
      try {
        await supabase
          .from('empresa_muestras')
          .delete()
          .eq('empresa_id', id);
      } catch (err) {
        console.log('⚠️ No se pudieron eliminar relaciones:', err.message);
      }

      // Luego eliminar la empresa
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['empresas']);
      queryClient.invalidateQueries(['empresa_muestras']);
      toast.success('Empresa eliminada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    }
  });

  const handleOpenDialog = (empresa = null) => {
    if (empresa) {
      setEditingEmpresa(empresa);
      setFormData({
        nombre: empresa.nombre || '',
        email: empresa.email || '',
        telefono: empresa.telefono || '',
        direccion: empresa.direccion || '',
        cif: empresa.cif || '',
        contacto: empresa.contacto || ''
      });

      // Cargar muestras asignadas
      const muestrasAsignadas = empresaMuestras
        .filter(em => em.empresa_id === empresa.id)
        .map(em => em.muestra_id);
      setSelectedMuestras(muestrasAsignadas);
    } else {
      setEditingEmpresa(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        cif: '',
        contacto: ''
      });
      setSelectedMuestras([]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmpresa(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      cif: '',
      contacto: ''
    });
    setSelectedMuestras([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre de la empresa es obligatorio');
      return;
    }

    empresaMutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMuestra = (muestraId) => {
    setSelectedMuestras(prev => {
      if (prev.includes(muestraId)) {
        return prev.filter(id => id !== muestraId);
      } else {
        return [...prev, muestraId];
      }
    });
  };

  const getMuestrasDeEmpresa = (empresaId) => {
    const muestraIds = empresaMuestras
      .filter(em => em.empresa_id === empresaId)
      .map(em => em.muestra_id);
    
    return muestras.filter(m => muestraIds.includes(m.id));
  };

  if (loadingEmpresas) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Empresas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de empresas productoras y sus muestras de vino
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Empresa
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}
              </DialogTitle>
              <DialogDescription>
                {editingEmpresa 
                  ? 'Modifica los datos de la empresa y sus muestras asignadas'
                  : 'Completa los datos de la nueva empresa y asigna sus muestras'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos de la Empresa */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Datos de la Empresa
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="nombre">
                      Nombre de la Empresa <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Bodegas La Rioja"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contacto@bodega.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="+34 123 456 789"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Calle Principal 123, Ciudad"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cif">CIF/NIF</Label>
                    <Input
                      id="cif"
                      name="cif"
                      value={formData.cif}
                      onChange={handleInputChange}
                      placeholder="A12345678"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contacto">Persona de Contacto</Label>
                    <Input
                      id="contacto"
                      name="contacto"
                      value={formData.contacto}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>
              </div>

              {/* Muestras Asignadas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Wine className="h-5 w-5 text-purple-600" />
                  Muestras de Vino
                </h3>

                {loadingMuestras ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : muestras.length === 0 ? (
                  <div className="text-center py-8 bg-muted rounded-lg">
                    <Wine className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No hay muestras disponibles</p>
                  </div>
                ) : (
                  <ScrollArea className="h-64 border rounded-lg p-4">
                    <div className="space-y-2">
                      {muestras.map((muestra) => (
                        <div
                          key={muestra.id}
                          className="flex items-center space-x-3 p-3 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Checkbox
                            id={`muestra-${muestra.id}`}
                            checked={selectedMuestras.includes(muestra.id)}
                            onCheckedChange={() => toggleMuestra(muestra.id)}
                          />
                          <label
                            htmlFor={`muestra-${muestra.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium">{muestra.nombre || muestra.codigo}</div>
                            <div className="text-sm text-muted-foreground">
                              {muestra.codigo && `Código: ${muestra.codigo}`}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {selectedMuestras.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedMuestras.length} muestra(s) seleccionada(s)
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={empresaMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={empresaMutation.isPending}>
                  {empresaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingEmpresa ? 'Actualizar' : 'Crear'} Empresa
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Empresas */}
      {empresas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay empresas registradas</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Comienza creando tu primera empresa productora
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primera Empresa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {empresas.map((empresa) => {
            const muestrasEmpresa = getMuestrasDeEmpresa(empresa.id);
            
            return (
              <Card key={empresa.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        {empresa.nombre}
                      </CardTitle>
                      {empresa.cif && (
                        <CardDescription className="mt-1">
                          CIF: {empresa.cif}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {muestrasEmpresa.length} muestra{muestrasEmpresa.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Información de contacto */}
                    <div className="space-y-2 text-sm">
                      {empresa.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{empresa.email}</span>
                        </div>
                      )}
                      {empresa.telefono && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{empresa.telefono}</span>
                        </div>
                      )}
                      {empresa.direccion && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{empresa.direccion}</span>
                        </div>
                      )}
                      {empresa.contacto && (
                        <div className="text-muted-foreground">
                          Contacto: <span className="font-medium">{empresa.contacto}</span>
                        </div>
                      )}
                    </div>

                    {/* Muestras asignadas */}
                    {muestrasEmpresa.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <Wine className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Muestras:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {muestrasEmpresa.slice(0, 3).map((muestra) => (
                            <Badge key={muestra.id} variant="outline" className="text-xs">
                              {muestra.codigo || muestra.nombre}
                            </Badge>
                          ))}
                          {muestrasEmpresa.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{muestrasEmpresa.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleOpenDialog(empresa)}
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la empresa "${empresa.nombre}"?`)) {
                            deleteMutation.mutate(empresa.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Información adicional */}
      {empresas.length > 0 && (
        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Gestión de Empresas y Muestras</p>
                <p className="text-muted-foreground">
                  Las empresas pueden tener múltiples muestras asignadas. Cada muestra puede pertenecer
                  a una sola empresa. Asigna las muestras al crear o editar una empresa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
