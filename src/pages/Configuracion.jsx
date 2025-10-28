import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Settings, Users, AlertCircle, Trash2, Edit, Crown, Database } from 'lucide-react';
import { supabase } from '../api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setupMesasWithPresidente } from '../utils/setupMesas';

const Configuracion = () => {
  const [isCreatingMesa, setIsCreatingMesa] = useState(false);
  const [isEditingMesa, setIsEditingMesa] = useState(false);
  const [editingMesaId, setEditingMesaId] = useState(null);
  const [newMesa, setNewMesa] = useState({
    numero: '',
    nombre: '',
    capacidad_total: 5,
    presidente_id: null
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  
  const queryClient = useQueryClient();

  // Obtener todas las mesas
  const { data: mesas, isLoading: loadingMesas, error: errorMesas } = useQuery({
    queryKey: ['mesas-config'],
    queryFn: async () => {
      // Primero intentamos con presidente, si falla usamos consulta simple
      try {
        const { data, error } = await supabase
          .from('mesas')
          .select(`
            *,
            presidente:catadores!mesas_presidente_id_fkey(id, nombre, email),
            ocupantes:catadores!catadores_mesa_id_fkey(id, nombre, email)
          `)
          .order('numero');
        
        if (error) throw error;
        return data;
      } catch (err) {
        // Si falla, probablemente la columna presidente_id no existe
        console.log('Usando consulta sin presidente_id:', err.message);
        const { data, error } = await supabase
          .from('mesas')
          .select(`
            *,
            ocupantes:catadores!catadores_mesa_id_fkey(id, nombre, email)
          `)
          .order('numero');
        
        if (error) throw error;
        
        // Agregar campo presidente como null para compatibilidad
        return data?.map(mesa => ({ ...mesa, presidente: null, presidente_id: null })) || [];
      }
    }
  });

  // Obtener catadores disponibles para ser presidentes
  const { data: catadoresDisponibles } = useQuery({
    queryKey: ['catadores-disponibles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catadores')
        .select('id, nombre, email, mesa_id')
        .order('nombre');
      
      if (error) throw error;
      return data;
    }
  });

  // Mutación para crear mesa
  const createMesaMutation = useMutation({
    mutationFn: async (mesaData) => {
      // Intentar crear con presidente_id, si falla crear sin él
      try {
        const { data, error } = await supabase
          .from('mesas')
          .insert([mesaData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch {
        // Si falla, intentar sin presidente_id
        // eslint-disable-next-line no-unused-vars
        const { presidente_id, ...mesaDataSinPresidente } = mesaData;
        const { data, error } = await supabase
          .from('mesas')
          .insert([mesaDataSinPresidente])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mesas-config']);
      queryClient.invalidateQueries(['catadores-disponibles']);
      setIsCreatingMesa(false);
      setNewMesa({ numero: '', nombre: '', capacidad_total: 5, presidente_id: null });
      showAlert('Mesa creada exitosamente', 'success');
    },
    onError: (error) => {
      showAlert(`Error al crear mesa: ${error.message}`, 'error');
    }
  });

  // Mutación para actualizar mesa
  const updateMesaMutation = useMutation({
    mutationFn: async ({ id, ...mesaData }) => {
      const { data, error } = await supabase
        .from('mesas')
        .update(mesaData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mesas-config']);
      queryClient.invalidateQueries(['catadores-disponibles']);
      setIsEditingMesa(false);
      setEditingMesaId(null);
      setNewMesa({ numero: '', nombre: '', capacidad_total: 5, presidente_id: null });
      showAlert('Mesa actualizada exitosamente', 'success');
    },
    onError: (error) => {
      showAlert(`Error al actualizar mesa: ${error.message}`, 'error');
    }
  });

  // Mutación para eliminar mesa
  const deleteMesaMutation = useMutation({
    mutationFn: async (mesaId) => {
      // Primero verificar que no tenga catadores asignados
      const { data: catadores } = await supabase
        .from('catadores')
        .select('id')
        .eq('mesa_id', mesaId);

      if (catadores && catadores.length > 0) {
        throw new Error('No se puede eliminar una mesa con catadores asignados');
      }

      const { error } = await supabase
        .from('mesas')
        .delete()
        .eq('id', mesaId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mesas-config']);
      queryClient.invalidateQueries(['catadores-disponibles']);
      showAlert('Mesa eliminada exitosamente', 'success');
    },
    onError: (error) => {
      showAlert(`Error al eliminar mesa: ${error.message}`, 'error');
    }
  });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 5000);
  };

  const handleCreateMesa = () => {
    if (!newMesa.numero || !newMesa.nombre) {
      showAlert('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    // Verificar que el número no esté repetido
    const numeroExists = mesas?.some(mesa => mesa.numero === parseInt(newMesa.numero));
    if (numeroExists) {
      showAlert('Ya existe una mesa con ese número', 'error');
      return;
    }

    createMesaMutation.mutate({
      numero: parseInt(newMesa.numero),
      nombre: newMesa.nombre,
      capacidad_total: newMesa.capacidad_total,
      presidente_id: newMesa.presidente_id || null
    });
  };

  const handleEditMesa = (mesa) => {
    setEditingMesaId(mesa.id);
    setNewMesa({
      numero: mesa.numero.toString(),
      nombre: mesa.nombre,
      capacidad_total: mesa.capacidad_total,
      presidente_id: mesa.presidente_id
    });
    setIsEditingMesa(true);
  };

  const handleUpdateMesa = () => {
    if (!newMesa.numero || !newMesa.nombre) {
      showAlert('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    // Verificar que el número no esté repetido (excepto la mesa actual)
    const numeroExists = mesas?.some(mesa => 
      mesa.numero === parseInt(newMesa.numero) && mesa.id !== editingMesaId
    );
    if (numeroExists) {
      showAlert('Ya existe una mesa con ese número', 'error');
      return;
    }

    updateMesaMutation.mutate({
      id: editingMesaId,
      numero: parseInt(newMesa.numero),
      nombre: newMesa.nombre,
      capacidad_total: newMesa.capacidad_total,
      presidente_id: newMesa.presidente_id || null
    });
  };

  const getPresidentesDisponibles = () => {
    if (!catadoresDisponibles) return [];
    
    // Catadores sin mesa asignada o que ya son presidentes de alguna mesa
    return catadoresDisponibles.filter(catador => 
      !catador.mesa_id || 
      mesas?.some(mesa => mesa.presidente_id === catador.id)
    );
  };

  const handleInitialSetup = async () => {
    setIsSetupRunning(true);
    try {
      const result = await setupMesasWithPresidente();
      
      if (result.success) {
        showAlert(result.message, 'success');
        queryClient.invalidateQueries(['mesas-config']);
        queryClient.invalidateQueries(['catadores-disponibles']);
      } else {
        showAlert(result.message, 'error');
      }
    } catch (error) {
      showAlert(`Error en configuración inicial: ${error.message}`, 'error');
    } finally {
      setIsSetupRunning(false);
    }
  };

  if (loadingMesas) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#333951] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (errorMesas) {
    return (
      <Alert className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar la configuración: {errorMesas.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-[#333951]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600">Gestiona las mesas y catadores del sistema</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert className={`mb-6 ${
          alert.type === 'success' ? 'border-green-500 bg-green-50' : 
          alert.type === 'error' ? 'border-red-500 bg-red-50' : 
          'border-blue-500 bg-blue-50'
        }`}>
          <AlertCircle className={`h-4 w-4 ${
            alert.type === 'success' ? 'text-green-600' : 
            alert.type === 'error' ? 'text-red-600' : 
            'text-blue-600'
          }`} />
          <AlertDescription className={
            alert.type === 'success' ? 'text-green-800' : 
            alert.type === 'error' ? 'text-red-800' : 
            'text-blue-800'
          }>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Configuración Inicial */}
      {(!mesas || mesas.length === 0) && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Database className="h-5 w-5" />
              Configuración Inicial del Sistema
            </CardTitle>
            <CardDescription className="text-blue-600">
              Parece que es la primera vez que usas el sistema. Configura las mesas iniciales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleInitialSetup}
                disabled={isSetupRunning}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSetupRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Configurando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Configurar 5 Mesas Iniciales
                  </>
                )}
              </Button>
              <p className="text-sm text-blue-600">
                Esto creará 5 mesas por defecto con capacidad de 5 personas cada una
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuración de Mesas */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Mesas
              </CardTitle>
              <CardDescription>
                Cada mesa puede tener hasta 5 personas: 1 presidente y 4 catadores
              </CardDescription>
            </div>
            <Dialog open={isCreatingMesa} onOpenChange={setIsCreatingMesa}>
              <DialogTrigger asChild>
                <Button className="bg-[#333951] hover:bg-[#333951]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Mesa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Mesa</DialogTitle>
                  <DialogDescription>
                    Configura una nueva mesa para las catas
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="numero" className="text-right">
                      Número *
                    </Label>
                    <Input
                      id="numero"
                      type="number"
                      value={newMesa.numero}
                      onChange={(e) => setNewMesa({...newMesa, numero: e.target.value})}
                      className="col-span-3"
                      placeholder="1, 2, 3..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nombre" className="text-right">
                      Nombre *
                    </Label>
                    <Input
                      id="nombre"
                      value={newMesa.nombre}
                      onChange={(e) => setNewMesa({...newMesa, nombre: e.target.value})}
                      className="col-span-3"
                      placeholder="Mesa Principal, Mesa A..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacidad" className="text-right">
                      Capacidad
                    </Label>
                    <Input
                      id="capacidad"
                      type="number"
                      value={newMesa.capacidad_total}
                      onChange={(e) => setNewMesa({...newMesa, capacidad_total: parseInt(e.target.value)})}
                      className="col-span-3"
                      min="3"
                      max="10"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="presidente" className="text-right">
                      Presidente
                    </Label>
                    <Select
                      value={newMesa.presidente_id?.toString() || ""}
                      onValueChange={(value) => setNewMesa({...newMesa, presidente_id: value ? parseInt(value) : null})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar presidente (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sin asignar</SelectItem>
                        {getPresidentesDisponibles().map((catador) => (
                          <SelectItem key={catador.id} value={catador.id.toString()}>
                            {catador.nombre} ({catador.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatingMesa(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateMesa}
                    className="bg-[#333951] hover:bg-[#333951]/90"
                    disabled={createMesaMutation.isPending}
                  >
                    {createMesaMutation.isPending ? 'Creando...' : 'Crear Mesa'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mesas?.map((mesa) => (
              <div key={mesa.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[#333951] border-[#333951]">
                      Mesa {mesa.numero}
                    </Badge>
                    <h3 className="font-semibold text-lg">{mesa.nombre}</h3>
                    {mesa.presidente && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Crown className="h-3 w-3 mr-1" />
                        {mesa.presidente.nombre}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMesa(mesa)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
                          deleteMesaMutation.mutate(mesa.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Ocupación: {mesa.ocupantes?.length || 0} / {mesa.capacidad_total} personas
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    (mesa.ocupantes?.length || 0) >= mesa.capacidad_total 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {(mesa.ocupantes?.length || 0) >= mesa.capacidad_total ? 'Completa' : 'Disponible'}
                  </span>
                </div>

                {mesa.ocupantes && mesa.ocupantes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Catadores asignados:</p>
                    <div className="flex flex-wrap gap-2">
                      {mesa.ocupantes.map((catador) => (
                        <Badge key={catador.id} variant="secondary" className="text-xs">
                          {catador.nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {(!mesas || mesas.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No hay mesas configuradas</p>
                <p className="text-sm">Crea la primera mesa para comenzar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para editar mesa */}
      <Dialog open={isEditingMesa} onOpenChange={setIsEditingMesa}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Mesa</DialogTitle>
            <DialogDescription>
              Modifica la configuración de la mesa
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-numero" className="text-right">
                Número *
              </Label>
              <Input
                id="edit-numero"
                type="number"
                value={newMesa.numero}
                onChange={(e) => setNewMesa({...newMesa, numero: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nombre" className="text-right">
                Nombre *
              </Label>
              <Input
                id="edit-nombre"
                value={newMesa.nombre}
                onChange={(e) => setNewMesa({...newMesa, nombre: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacidad" className="text-right">
                Capacidad
              </Label>
              <Input
                id="edit-capacidad"
                type="number"
                value={newMesa.capacidad_total}
                onChange={(e) => setNewMesa({...newMesa, capacidad_total: parseInt(e.target.value)})}
                className="col-span-3"
                min="3"
                max="10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-presidente" className="text-right">
                Presidente
              </Label>
              <Select
                value={newMesa.presidente_id?.toString() || ""}
                onValueChange={(value) => setNewMesa({...newMesa, presidente_id: value ? parseInt(value) : null})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar presidente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {getPresidentesDisponibles().map((catador) => (
                    <SelectItem key={catador.id} value={catador.id.toString()}>
                      {catador.nombre} ({catador.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingMesa(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateMesa}
              className="bg-[#333951] hover:bg-[#333951]/90"
              disabled={updateMesaMutation.isPending}
            >
              {updateMesaMutation.isPending ? 'Actualizando...' : 'Actualizar Mesa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#333951] mb-2">
                {mesas?.length || 0}
              </div>
              <p className="text-gray-600">Mesas Configuradas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {mesas?.reduce((acc, mesa) => acc + (mesa.ocupantes?.length || 0), 0) || 0}
              </div>
              <p className="text-gray-600">Catadores Asignados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {mesas?.reduce((acc, mesa) => acc + mesa.capacidad_total, 0) || 0}
              </div>
              <p className="text-gray-600">Capacidad Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracion;