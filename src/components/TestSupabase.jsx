import { supabase } from '../api/supabaseClient';

function TestSupabase() {
  const createAdminUser = async () => {
    const email = prompt('Ingresa tu email para crear el usuario admin:', 'admin@virtus.com');
    if (!email) return;
    
    const password = prompt('Ingresa una contraseña para el usuario admin:', 'admin123');
    if (!password) return;

    console.log('👤 Creando usuario administrador...');
    
    try {
      // Importar bcrypt para hashear la contraseña
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Usar solo las columnas básicas que sabemos que existen + password_hash
      const adminData = {
        nombre: 'Administrador',
        email: email,
        password_hash: hashedPassword,
        activo: true,
        codigo: 1
      };
      
      console.log('🔐 Contraseña hasheada con bcrypt...');

      const { data, error } = await supabase
        .from('catadores')
        .insert(adminData)
        .select();

      if (error) {
        console.error('❌ Error creando admin:', error);
        alert('Error: ' + error.message);
      } else {
        console.log('✅ Admin creado:', data);
        alert(`✅ Usuario admin creado exitosamente!\nEmail: ${email}\nContraseña: ${password}\n\n🔐 Contraseña hasheada con bcrypt`);
      }
    } catch (err) {
      console.error('💥 Error:', err);
      alert('Error: ' + err.message);
    }
  };

  const createSampleData = async () => {
    console.log('📊 Creando datos de ejemplo...');
    
    try {
      // Crear algunos catadores de ejemplo con contraseñas
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      
      const catadores = [
        { 
          nombre: 'Juan Pérez', 
          email: 'juan@virtus.com', 
          password_hash: await bcrypt.hash('juan123', salt),
          activo: true, 
          codigo: 2 
        },
        { 
          nombre: 'María García', 
          email: 'maria@virtus.com', 
          password_hash: await bcrypt.hash('maria123', salt),
          activo: true, 
          codigo: 3 
        },
        { 
          nombre: 'Carlos López', 
          email: 'carlos@virtus.com', 
          password_hash: await bcrypt.hash('carlos123', salt),
          activo: true, 
          codigo: 4 
        }
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
            `${catadores.length} catadores y ${muestras.length} muestras agregados\n\n` +
            '🔐 Contraseñas de catadores:\n' +
            'juan@virtus.com - juan123\n' +
            'maria@virtus.com - maria123\n' +
            'carlos@virtus.com - carlos123');

    } catch (err) {
      console.error('💥 Error:', err);
      alert('Error: ' + err.message);
    }
  };

  const checkTableSchema = async () => {
    console.log('🗂️ Verificando esquema de tablas...');
    
    try {
      // Intentar obtener un registro para ver las columnas disponibles
      const { data: sampleCatador, error: catadorError } = await supabase
        .from('catadores')
        .select('*')
        .limit(1);
      
      if (catadorError) {
        console.log('❌ No se pudo acceder a catadores:', catadorError.message);
      } else {
        console.log('📋 Estructura de tabla catadores:');
        if (sampleCatador && sampleCatador.length > 0) {
          console.log('Columnas disponibles:', Object.keys(sampleCatador[0]));
        } else {
          console.log('Tabla catadores existe pero está vacía');
        }
      }

      const { data: sampleMuestra, error: muestraError } = await supabase
        .from('muestras')
        .select('*')
        .limit(1);
      
      if (muestraError) {
        console.log('❌ No se pudo acceder a muestras:', muestraError.message);
      } else {
        console.log('📋 Estructura de tabla muestras:');
        if (sampleMuestra && sampleMuestra.length > 0) {
          console.log('Columnas disponibles:', Object.keys(sampleMuestra[0]));
        } else {
          console.log('Tabla muestras existe pero está vacía');
        }
      }

    } catch (err) {
      console.error('💥 Error verificando esquema:', err);
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
      
      <button 
        onClick={checkTableSchema}
        style={{ 
          padding: '10px 20px', 
          background: '#6c757d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        Ver Esquema de Tablas
      </button>
      
      <p><small>Abre la consola del navegador (F12) para ver los resultados</small></p>
    </div>
  );
}

export default TestSupabase;