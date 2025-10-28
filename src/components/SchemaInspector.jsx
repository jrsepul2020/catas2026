import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/api/supabaseClient';

const SchemaInspector = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [schemas, setSchemas] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 10000);
  };

  const checkTableSchema = async (tableName) => {
    try {
      // Intentar obtener un registro para ver las columnas disponibles
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`Error checking ${tableName}:`, error);
        return { error: error.message, columns: [] };
      }
      
      // Si hay datos, obtener las columnas del primer registro
      const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
      
      return { columns, count: data?.length || 0 };
    } catch (err) {
      return { error: err.message, columns: [] };
    }
  };

  const checkAllSchemas = async () => {
    setIsChecking(true);
    setSchemas({});
    
    try {
      const tables = ['empresas', 'muestras', 'catadores', 'mesas', 'catas'];
      const results = {};
      
      for (const table of tables) {
        console.log(`🔍 Checking schema for ${table}...`);
        results[table] = await checkTableSchema(table);
      }
      
      setSchemas(results);
      showAlert('Esquemas de tablas revisados correctamente', 'success');
    } catch (error) {
      showAlert(`Error revisando esquemas: ${error.message}`, 'error');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-8 w-8 text-[#333951]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inspector de Esquemas</h1>
          <p className="text-gray-600">Revisa las columnas disponibles en cada tabla</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert className={`mb-6 ${
          alert.type === 'success' ? 'border-green-500 bg-green-50' : 
          alert.type === 'error' ? 'border-red-500 bg-red-50' : 
          'border-blue-500 bg-blue-50'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className={`h-4 w-4 ${
              alert.type === 'error' ? 'text-red-600' : 'text-blue-600'
            }`} />
          )}
          <AlertDescription className={
            alert.type === 'success' ? 'text-green-800' : 
            alert.type === 'error' ? 'text-red-800' : 
            'text-blue-800'
          }>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Botón para revisar esquemas */}
      <div className="text-center mb-6">
        <Button
          onClick={checkAllSchemas}
          disabled={isChecking}
          className="bg-[#333951] hover:bg-[#333951]/90 text-white px-8 py-3"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Revisando Esquemas...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Revisar Esquemas de Tablas
            </>
          )}
        </Button>
      </div>

      {/* Resultados */}
      {Object.keys(schemas).length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(schemas).map(([tableName, schema]) => (
            <Card key={tableName} className={`${
              schema.error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  schema.error ? 'text-red-700' : 'text-green-700'
                }`}>
                  {schema.error ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  {tableName}
                </CardTitle>
                <CardDescription className={
                  schema.error ? 'text-red-600' : 'text-green-600'
                }>
                  {schema.error ? 'Error accediendo a la tabla' : `${schema.columns.length} columnas encontradas`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {schema.error ? (
                  <div className="text-sm text-red-700">
                    <strong>Error:</strong> {schema.error}
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Columnas disponibles:</h4>
                    <div className="space-y-1">
                      {schema.columns.map((column) => (
                        <div key={column} className="text-sm font-mono bg-white px-2 py-1 rounded border">
                          {column}
                        </div>
                      ))}
                    </div>
                    {schema.count !== undefined && (
                      <div className="mt-3 text-sm text-green-700">
                        <strong>Registros encontrados:</strong> {schema.count}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>ℹ️ Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Esta herramienta revisa las columnas realmente disponibles en cada tabla de Supabase.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Usa esta información para ajustar los datos de ejemplo a la estructura real de tu base de datos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemaInspector;