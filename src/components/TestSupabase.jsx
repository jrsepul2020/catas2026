import { supabase } from '../api/supabaseClient';
import SchemaInspector from './SchemaInspector';
import { useState } from 'react';

function TestSupabase() {
  const [showSchemaInspector, setShowSchemaInspector] = useState(false);
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
    alert('🗂️ Verificando esquema... Revisa la consola (F12)');
    
    try {
      // Intentar obtener un registro para ver las columnas disponibles
      console.log('👥 Obteniendo muestra de catadores...');
      const catadorResult = await supabase
        .from('catadores')
        .select('*')
        .limit(1);
      
      if (catadorResult.error) {
        console.log('❌ No se pudo acceder a catadores:', catadorResult.error.message);
        alert('❌ Error catadores: ' + catadorResult.error.message);
      } else {
        console.log('📋 Estructura de tabla catadores:');
        if (catadorResult.data && catadorResult.data.length > 0) {
          const columns = Object.keys(catadorResult.data[0]);
          console.log('Columnas disponibles:', columns);
          alert('✅ Catadores - Columnas: ' + columns.join(', '));
        } else {
          console.log('Tabla catadores existe pero está vacía');
          alert('⚠️ Tabla catadores está vacía');
        }
      }

      console.log('📊 Obteniendo muestra de muestras...');
      const muestraResult = await supabase
        .from('muestras')
        .select('*')
        .limit(1);
      
      if (muestraResult.error) {
        console.log('❌ No se pudo acceder a muestras:', muestraResult.error.message);
        alert('❌ Error muestras: ' + muestraResult.error.message);
      } else {
        console.log('📋 Estructura de tabla muestras:');
        if (muestraResult.data && muestraResult.data.length > 0) {
          const columns = Object.keys(muestraResult.data[0]);
          console.log('Columnas disponibles:', columns);
          alert('✅ Muestras - Columnas: ' + columns.join(', '));
        } else {
          console.log('Tabla muestras existe pero está vacía');
          alert('⚠️ Tabla muestras está vacía');
        }
      }

    } catch (err) {
      console.error('💥 Error verificando esquema:', err);
      alert('💥 Error: ' + err.message);
    }
  };

  const testConnection = async () => {
    console.log('🔍 Iniciando pruebas de Supabase...');
    alert('🔍 Iniciando pruebas... Revisa la consola (F12)');
    
    try {
      // Verificar que supabase esté disponible
      console.log('🔗 Cliente Supabase:', supabase);
      
      // Probar muestras
      console.log('📊 Probando tabla muestras...');
      const muestrasResult = await supabase
        .from('muestras')
        .select('*', { count: 'exact' });
      
      console.log('📊 Resultado completo muestras:', muestrasResult);
      
      if (muestrasResult.error) {
        console.error('❌ Error muestras:', muestrasResult.error);
        alert('❌ Error en muestras: ' + muestrasResult.error.message);
      } else {
        console.log('✅ Muestras encontradas:', muestrasResult.count);
        console.log('📋 Primeras 5 muestras:', muestrasResult.data?.slice(0, 5));
        alert(`✅ Muestras: ${muestrasResult.count} registros encontrados`);
      }

      // Probar catadores
      console.log('👥 Probando tabla catadores...');
      const catadoresResult = await supabase
        .from('catadores')
        .select('*', { count: 'exact' });
      
      console.log('👥 Resultado completo catadores:', catadoresResult);
      
      if (catadoresResult.error) {
        console.error('❌ Error catadores:', catadoresResult.error);
        alert('❌ Error en catadores: ' + catadoresResult.error.message);
      } else {
        console.log('✅ Catadores encontrados:', catadoresResult.count);
        console.log('📋 Primeros 5 catadores:', catadoresResult.data?.slice(0, 5));
        alert(`✅ Catadores: ${catadoresResult.count} registros encontrados`);
      }

      // Probar las tablas disponibles
      console.log('🗂️ Probando listar tablas...');
      const tablesResult = await supabase
        .rpc('get_table_names');
      
      if (tablesResult.error) {
        console.log('📝 No se pudo obtener lista de tablas (normal):', tablesResult.error.message);
      } else {
        console.log('📋 Tablas disponibles:', tablesResult.data);
      }
      
      alert('✅ Pruebas completadas. Revisa la consola para detalles.');

    } catch (err) {
      console.error('💥 Error general:', err);
      alert('💥 Error general: ' + err.message);
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