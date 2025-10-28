import { supabase } from '../api/supabaseClient';

function TestSupabase() {
  const createAdminUser = async () => {
    const email = prompt('Ingresa tu email para crear el usuario admin:', 'admin@virtus.com');
    if (!email) return;

    console.log('👤 Creando usuario administrador...');
    
    const adminData = {
      nombre: 'Administrador',
      email: email,
      rol: 'Presidente',
      mesa: 'Mesa 1',
      puesto: 'Puesto 1',
      tablet: 'Tablet 01',
      activo: true,
      codigo: 1
    };

    try {
      const { data, error } = await supabase
        .from('catadores')
        .insert(adminData)
        .select();

      if (error) {
        console.error('❌ Error creando admin:', error);
        alert('Error: ' + error.message);
      } else {
        console.log('✅ Admin creado:', data);
        alert(`✅ Usuario admin creado exitosamente!\nEmail: ${email}\nPuedes usar cualquier password\n\n⚠️ Ahora debes activar la autenticación en el código`);
      }
    } catch (err) {
      console.error('💥 Error:', err);
      alert('Error: ' + err.message);
    }
  };

  const createSampleData = async () => {
    console.log('📊 Creando datos de ejemplo...');
    
    try {
      // Crear algunos catadores de ejemplo
      const catadores = [
        { nombre: 'Juan Pérez', email: 'juan@virtus.com', rol: 'Catador', mesa: 'Mesa 1', puesto: 'Puesto 2', tablet: 'Tablet 02', activo: true, codigo: 2 },
        { nombre: 'María García', email: 'maria@virtus.com', rol: 'Experto', mesa: 'Mesa 2', puesto: 'Puesto 1', tablet: 'Tablet 03', activo: true, codigo: 3 },
        { nombre: 'Carlos López', email: 'carlos@virtus.com', rol: 'Catador', mesa: 'Mesa 1', puesto: 'Puesto 3', tablet: 'Tablet 04', activo: true, codigo: 4 }
      ];

      const { data: catadoresData, error: catadoresError } = await supabase
        .from('catadores')
        .insert(catadores)
        .select();

      if (catadoresError) {
        console.error('❌ Error creando catadores:', catadoresError);
      } else {
        console.log('✅ Catadores creados:', catadoresData);
      }

      // Crear algunas muestras de ejemplo
      const muestras = [
        { nombre: 'Ribera del Duero 2020', codigo: 101, empresa: 'Bodegas García', origen: 'Valladolid', categoria: 'Tinto', activo: true, existencias: 50 },
        { nombre: 'Albariño 2021', codigo: 102, empresa: 'Bodegas Mar', origen: 'Rías Baixas', categoria: 'Blanco', activo: true, existencias: 30 },
        { nombre: 'Tempranillo Reserva', codigo: 103, empresa: 'Viñedos del Norte', origen: 'Rioja', categoria: 'Tinto', activo: true, existencias: 25 },
        { nombre: 'Verdejo Joven', codigo: 104, empresa: 'Bodegas Sol', origen: 'Rueda', categoria: 'Blanco', activo: true, existencias: 40 }
      ];

      const { data: muestrasData, error: muestrasError } = await supabase
        .from('muestras')
        .insert(muestras)
        .select();

      if (muestrasError) {
        console.error('❌ Error creando muestras:', muestrasError);
      } else {
        console.log('✅ Muestras creadas:', muestrasData);
      }

      alert('✅ Datos de ejemplo creados exitosamente!\n' +
            `${catadores.length} catadores y ${muestras.length} muestras agregados`);

    } catch (err) {
      console.error('💥 Error:', err);
      alert('Error: ' + err.message);
    }
  };

  const testConnection = async () => {
    console.log('🔍 Iniciando pruebas de Supabase...');
    
    try {
      // Probar muestras
      console.log('📊 Probando tabla muestras...');
      const { data: muestrasData, error: muestrasError, count: muestrasCount } = await supabase
        .from('muestras')
        .select('*', { count: 'exact' });
      
      if (muestrasError) {
        console.error('❌ Error muestras:', muestrasError);
      } else {
        console.log('✅ Muestras encontradas:', muestrasCount);
        console.log('📋 Primeras 5 muestras:', muestrasData?.slice(0, 5));
      }

      // Probar catadores
      console.log('👥 Probando tabla catadores...');
      const { data: catadoresData, error: catadoresError, count: catadoresCount } = await supabase
        .from('catadores')
        .select('*', { count: 'exact' });
      
      if (catadoresError) {
        console.error('❌ Error catadores:', catadoresError);
      } else {
        console.log('✅ Catadores encontrados:', catadoresCount);
        console.log('📋 Primeros 5 catadores:', catadoresData?.slice(0, 5));
      }

      // Probar las tablas disponibles
      console.log('🗂️ Probando listar tablas...');
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_table_names');
      
      if (tablesError) {
        console.log('📝 No se pudo obtener lista de tablas (normal)');
      } else {
        console.log('📋 Tablas disponibles:', tablesData);
      }

    } catch (err) {
      console.error('💥 Error general:', err);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>🔧 Test Supabase</h3>
      <button 
        onClick={testConnection}
        style={{ 
          padding: '10px 20px', 
          background: '#333951', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Probar Conexión Supabase
      </button>
      
      <button 
        onClick={createAdminUser}
        style={{ 
          padding: '10px 20px', 
          background: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        Crear Usuario Admin
      </button>
      
      <button 
        onClick={createSampleData}
        style={{ 
          padding: '10px 20px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        Crear Datos de Ejemplo
      </button>
      
      <p><small>Abre la consola del navegador (F12) para ver los resultados</small></p>
    </div>
  );
}

export default TestSupabase;