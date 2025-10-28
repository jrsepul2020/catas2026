import TestSupabase from '../components/TestSupabase';

export default function ConfiguracionInicial() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#333951] mb-6">
            🔧 Configuración Inicial
          </h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Página de Configuración Temporal
            </h2>
            <p className="text-yellow-700">
              Esta página es solo para la configuración inicial de la base de datos. 
              Una vez que hayas creado tu usuario admin y datos de ejemplo, 
              puedes eliminar esta página.
            </p>
          </div>

          <TestSupabase />
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Instrucciones:</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>Haz clic en "Ver Esquema de Tablas" para verificar la estructura</li>
              <li>Crea tu usuario admin con "Crear Usuario Admin"</li>
              <li>Opcionalmente, crea datos de ejemplo con "Crear Datos de Ejemplo"</li>
              <li>Ve a la página de login y usa tus credenciales</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}