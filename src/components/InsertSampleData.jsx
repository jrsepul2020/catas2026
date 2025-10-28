import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Database, Trash2, Users, Building, Wine, AlertCircle, CheckCircle, Loader2, Search } from 'lucide-react';
import { insertSampleData, clearSampleData, inspectDatabaseSchema } from '@/utils/insertSampleDataDetective';

const InsertSampleData = () => {
  const [isInserting, setIsInserting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [result, setResult] = useState(null);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 5000);
  };

  const handleInsertData = async () => {
    setIsInserting(true);
    setResult(null);
    
    try {
      console.log('🔍 Verificando estructura de base de datos antes de insertar...');
      const response = await insertSampleData();
      
      if (response.success) {
        setResult(response);
        const empresasCount = response.empresas?.length || 0;
        const muestrasCount = response.muestras?.length || 0;
        const catadoresCount = response.catadores?.length || 0;
        const totalExpected = 5 + 8 + 10; // 23 total
        const totalInserted = empresasCount + muestrasCount + catadoresCount;
        
        if (response.errors && response.errors.length > 0) {
          showAlert(`Inserción parcial: ${empresasCount}/5 empresas, ${muestrasCount}/8 muestras, ${catadoresCount}/10 catadores. Total: ${totalInserted}/${totalExpected}. Errores: ${response.errors.join(', ')}`, 'warning');
        } else {
          showAlert(`¡Éxito total! Insertados: ${empresasCount}/5 empresas, ${muestrasCount}/8 muestras, ${catadoresCount}/10 catadores. Total: ${totalInserted}/${totalExpected} registros`, 'success');
        }
      } else {
        showAlert(`Error: ${response.error}`, 'error');
      }
    } catch (error) {
      console.error('Error en inserción:', error);
      showAlert(`Error insertando datos: ${error.message}`, 'error');
    } finally {
      setIsInserting(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los datos de ejemplo? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsClearing(true);
    
    try {
      const response = await clearSampleData();
      
      if (response.success) {
        setResult(null);
        showAlert('Datos eliminados correctamente', 'success');
      } else {
        showAlert(`Error: ${response.error}`, 'error');
      }
    } catch (error) {
      showAlert(`Error eliminando datos: ${error.message}`, 'error');
    } finally {
      setIsClearing(false);
    }
  };

  const handleInspectDatabase = async () => {
    setIsInspecting(true);
    
    try {
      const inspection = await inspectDatabaseSchema();
      setInspectionResult(inspection);
      showAlert('Inspección de base de datos completada', 'success');
    } catch (error) {
      showAlert(`Error inspeccionando base de datos: ${error.message}`, 'error');
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-8 w-8 text-[#333951]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Datos de Ejemplo</h1>
          <p className="text-gray-600">Inserta datos de prueba para empresas, muestras y catadores</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert className={`mb-6 ${
          alert.type === 'success' ? 'border-green-500 bg-green-50' : 
          alert.type === 'error' ? 'border-red-500 bg-red-50' : 
          alert.type === 'warning' ? 'border-orange-500 bg-orange-50' :
          'border-blue-500 bg-blue-50'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className={`h-4 w-4 ${
              alert.type === 'error' ? 'text-red-600' : 
              alert.type === 'warning' ? 'text-orange-600' :
              'text-blue-600'
            }`} />
          )}
          <AlertDescription className={
            alert.type === 'success' ? 'text-green-800' : 
            alert.type === 'error' ? 'text-red-800' : 
            alert.type === 'warning' ? 'text-orange-800' :
            'text-blue-800'
          }>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Información de los datos */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Contenido de los Datos de Ejemplo
          </CardTitle>
          <CardDescription>
            Los datos incluyen información realista para testing y demos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-2">5 Empresas</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bodegas Rioja Alta</li>
                <li>• Vinos del Duero S.L.</li>
                <li>• Cellers Catalanes</li>
                <li>• Bodegas Andaluzas</li>
                <li>• Viñedos Gallegos S.A.</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Wine className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-2">8 Muestras</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Rioja Reserva 2019</li>
                <li>• Ribera Crianza 2020</li>
                <li>• Cava Brut Reserva</li>
                <li>• Fino La Palma</li>
                <li>• Albariño Pazo Real</li>
                <li>• Garnacha Joven 2023</li>
                <li>• Rosado Premium</li>
                <li>• Moscatel Dulce</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-2">10 Catadores</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• María Elena R.</li>
                <li>• Antonio García</li>
                <li>• Carmen López</li>
                <li>• José Luis S.</li>
                <li>• Laura Jiménez</li>
                <li>• Miguel Ángel M.</li>
                <li>• Isabel Hernández</li>
                <li>• Francisco Ruiz</li>
                <li>• Patricia Álvarez</li>
                <li>• Roberto Díaz</li>
              </ul>
              <p className="mt-2 text-blue-600 font-medium text-xs">🔐 Contraseña: cata2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-center mb-6 flex-wrap">
        <Button
          onClick={handleInspectDatabase}
          disabled={isInserting || isClearing || isInspecting}
          variant="outline"
          className="px-6 py-3"
        >
          {isInspecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Inspeccionando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Inspeccionar BD
            </>
          )}
        </Button>

        <Button
          onClick={handleInsertData}
          disabled={isInserting || isClearing || isInspecting}
          className="bg-[#333951] hover:bg-[#333951]/90 text-white px-8 py-3"
        >
          {isInserting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Insertando Datos...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Insertar Datos de Ejemplo
            </>
          )}
        </Button>

        <Button
          onClick={handleClearData}
          disabled={isInserting || isClearing || isInspecting}
          variant="destructive"
          className="px-8 py-3"
        >
          {isClearing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Eliminando...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Datos
            </>
          )}
        </Button>
      </div>

      {/* Resultado de la inserción */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Inserción Completada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-lg px-3 py-1">
                  {result.empresas}
                </Badge>
                <p className="text-sm text-green-700 mt-1">Empresas</p>
              </div>
              <div className="text-center">
                <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-lg px-3 py-1">
                  {result.muestras}
                </Badge>
                <p className="text-sm text-green-700 mt-1">Muestras</p>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 border-green-300 text-lg px-3 py-1">
                  {result.catadores}
                </Badge>
                <p className="text-sm text-green-700 mt-1">Catadores</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🔑 Credenciales de Acceso:</h4>
              <p className="text-sm text-green-700 mb-2">
                Todos los catadores tienen la contraseña: <code className="bg-green-200 px-2 py-1 rounded font-mono">cata2026</code>
              </p>
              <p className="text-xs text-green-600">
                Puedes usar cualquier email de catador (ej: maria.rodriguez@catas2026.com) con esta contraseña para hacer login.
              </p>
              
              {result.errors && result.errors.length > 0 && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                  <h5 className="font-medium text-orange-800 mb-1">⚠️ Advertencias:</h5>
                  <ul className="text-xs text-orange-700 space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados de inspección */}
      {inspectionResult && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Search className="h-5 w-5" />
              Estructura de Base de Datos
            </CardTitle>
            <CardDescription className="text-blue-600">
              Información detectada automáticamente de tus tablas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(inspectionResult).map(([tableName, info]) => (
                <div key={tableName} className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    📋 {tableName}
                  </h4>
                  
                  {info.exists ? (
                    <div>
                      <p className="text-sm text-blue-700 mb-2">
                        <strong>Estado:</strong> ✅ Accesible ({info.method})
                      </p>
                      
                      {info.columns && info.columns.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Columnas detectadas ({info.columns.length}):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {info.columns.map((column) => (
                              <span 
                                key={column} 
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono"
                              >
                                {column}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {info.requiredFields && info.requiredFields.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-orange-800 mb-1">
                            Campos requeridos:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {info.requiredFields.map((field) => (
                              <span 
                                key={field} 
                                className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono"
                              >
                                {field}*
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {info.count !== undefined && (
                        <p className="text-xs text-blue-600 mt-2">
                          Registros existentes: {info.count}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-red-700">
                        <strong>Estado:</strong> ❌ No accesible
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Error: {info.error}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Los datos se insertan en las tablas <code>empresas</code>, <code>muestras</code> y <code>catadores</code> de tu base de datos Supabase.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Las contraseñas están hasheadas con bcrypt por seguridad.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              La función &quot;Limpiar Datos&quot; eliminará <strong>TODOS</strong> los registros de estas tablas. Úsala con precaución.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsertSampleData;