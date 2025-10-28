import { supabase } from '../api/supabaseClient.js';
import bcrypt from 'bcryptjs';

// Función para obtener información completa de la tabla
async function getTableInfo(tableName) {
  console.log(`🔍 Inspeccionando tabla: ${tableName}`);
  
  try {
    // Método 1: Intentar obtener un registro para ver columnas
    const { data: sampleData, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (!sampleError && sampleData) {
      const columns = sampleData.length > 0 ? Object.keys(sampleData[0]) : [];
      console.log(`✅ ${tableName} - Método 1 exitoso. Columnas:`, columns);
      return { 
        exists: true, 
        columns, 
        method: 'sample_data',
        count: sampleData.length,
        sampleRecord: sampleData[0]
      };
    }
    
    // Método 2: Intentar insertar un registro vacío para ver qué campos son requeridos
    console.log(`⚠️ ${tableName} - Método 1 falló (${sampleError?.message}). Probando método 2...`);
    
    const { error: insertError } = await supabase
      .from(tableName)
      .insert({})
      .select();
    
    if (insertError) {
      console.log(`📋 ${tableName} - Error de inserción vacía:`, insertError.message);
      
      // Analizar el mensaje de error para encontrar campos requeridos
      const errorMsg = insertError.message.toLowerCase();
      let detectedColumns = [];
      
      // Buscar patrones comunes en mensajes de error de PostgreSQL/Supabase
      if (errorMsg.includes('null value in column')) {
        const match = errorMsg.match(/null value in column "([^"]+)"/);
        if (match) detectedColumns.push(match[1]);
      }
      
      if (errorMsg.includes('violates not-null constraint')) {
        const match = errorMsg.match(/column "([^"]+)" violates not-null constraint/);
        if (match) detectedColumns.push(match[1]);
      }
      
      return {
        exists: true,
        columns: detectedColumns,
        method: 'error_analysis',
        error: insertError.message,
        requiredFields: detectedColumns
      };
    }
    
    return { exists: false, error: `No se pudo acceder a la tabla ${tableName}` };
    
  } catch (err) {
    console.error(`❌ Error inspeccionando ${tableName}:`, err);
    return { 
      exists: false, 
      error: err.message,
      method: 'exception'
    };
  }
}

// Intentar insertar con campos mínimos detectados automáticamente
async function tryMinimalInsert(tableName, baseData) {
  const attempts = [
    // Intento 1: Solo ID auto-generado
    {},
    
    // Intento 2: Campos más comunes
    { name: baseData.name || 'Test' },
    { nombre: baseData.name || 'Test' },
    { title: baseData.name || 'Test' },
    
    // Intento 3: Con email si está disponible
    { 
      name: baseData.name || 'Test',
      email: baseData.email || 'test@example.com'
    },
    { 
      nombre: baseData.name || 'Test',
      email: baseData.email || 'test@example.com'
    },
    
    // Intento 4: Campos específicos por tipo de tabla
    ...(tableName === 'empresas' ? [
      { empresa: baseData.name || 'Test Empresa' },
      { razon_social: baseData.name || 'Test Empresa S.L.' },
      { denominacion: baseData.name || 'Test Empresa' }
    ] : []),
    
    ...(tableName === 'muestras' ? [
      { muestra: baseData.name || 'Test Muestra' },
      { codigo: baseData.code || 'TEST001' },
      { id_muestra: baseData.code || 'TEST001' }
    ] : []),
    
    ...(tableName === 'catadores' ? [
      { catador: baseData.name || 'Test Catador' },
      { usuario: baseData.name || 'testuser' },
      { login: baseData.email || 'test@example.com' }
    ] : [])
  ];
  
  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    console.log(`🔄 ${tableName} - Intento ${i + 1}:`, attempt);
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(attempt)
        .select();
      
      if (!error && data) {
        console.log(`✅ ${tableName} - Intento ${i + 1} exitoso!`, data[0]);
        return { success: true, data: data[0], method: `attempt_${i + 1}` };
      } else {
        console.log(`❌ ${tableName} - Intento ${i + 1} falló:`, error?.message);
      }
    } catch (err) {
      console.log(`❌ ${tableName} - Intento ${i + 1} excepción:`, err.message);
    }
  }
  
  return { success: false, message: 'Todos los intentos fallaron' };
}

export async function insertSampleData() {
  try {
    console.log('🚀 Iniciando inserción con detección automática...');
    const results = { 
      success: false, 
      empresas: 0, 
      muestras: 0, 
      catadores: 0, 
      errors: [],
      details: []
    };

    // Datos base para probar
    const testData = {
      empresas: [
        { name: 'Bodegas Test', email: 'test@bodegas.com' },
        { name: 'Viñedos Prueba', email: 'info@vinedos.com' }
      ],
      muestras: [
        { name: 'Vino Test 1', code: 'TEST001' },
        { name: 'Vino Test 2', code: 'TEST002' }
      ],
      catadores: [
        { name: 'Catador Test', email: 'catador@test.com', code: 'CAT001' }
      ]
    };

    // Procesar cada tabla
    for (const [tableName, dataArray] of Object.entries(testData)) {
      console.log(`\n📋 Procesando tabla: ${tableName}`);
      
      // Obtener información de la tabla
      const tableInfo = await getTableInfo(tableName);
      results.details.push({
        table: tableName,
        info: tableInfo
      });
      
      if (!tableInfo.exists) {
        results.errors.push(`${tableName}: Tabla no accesible - ${tableInfo.error}`);
        continue;
      }
      
      // Intentar insertar algunos registros de prueba
      let successCount = 0;
      const maxAttempts = Math.min(dataArray.length, 2); // Máximo 2 registros por tabla
      
      for (let i = 0; i < maxAttempts; i++) {
        const baseData = dataArray[i];
        const result = await tryMinimalInsert(tableName, baseData);
        
        if (result.success) {
          successCount++;
          console.log(`✅ ${tableName} - Registro ${i + 1} insertado correctamente`);
        } else {
          console.log(`❌ ${tableName} - Registro ${i + 1} falló: ${result.message}`);
        }
      }
      
      results[tableName] = successCount;
      
      if (successCount === 0) {
        results.errors.push(`${tableName}: No se pudo insertar ningún registro`);
      } else if (successCount < maxAttempts) {
        results.errors.push(`${tableName}: Solo se insertaron ${successCount} de ${maxAttempts} registros`);
      }
    }

    // Intentar añadir contraseñas a catadores si se insertaron
    if (results.catadores > 0) {
      try {
        console.log('🔐 Intentando añadir contraseñas a catadores...');
        const password = 'cata2026';
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        // Intentar actualizar catadores con contraseña
        const { error: updateError } = await supabase
          .from('catadores')
          .update({ password_hash })
          .not('id', 'is', null); // Actualizar todos los registros
        
        if (updateError) {
          console.log('⚠️ No se pudo añadir contraseñas:', updateError.message);
          results.errors.push('Catadores: Contraseñas no añadidas');
        } else {
          console.log('✅ Contraseñas añadidas a catadores');
        }
      } catch (err) {
        console.log('⚠️ Error añadiendo contraseñas:', err.message);
      }
    }

    // Determinar si fue exitoso
    results.success = results.empresas > 0 || results.muestras > 0 || results.catadores > 0;

    // Mostrar resumen
    console.log('\n🎯 RESUMEN DE INSERCIÓN AUTOMÁTICA');
    console.log('═══════════════════════════════════════');
    console.log(`📦 Empresas: ${results.empresas}`);
    console.log(`🍷 Muestras: ${results.muestras}`);
    console.log(`👥 Catadores: ${results.catadores}`);
    
    if (results.errors.length > 0) {
      console.log('\n⚠️ PROBLEMAS ENCONTRADOS:');
      results.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    if (results.success) {
      console.log('\n🔑 CREDENCIALES:');
      console.log('Contraseña para catadores: cata2026');
    }

    return results;

  } catch (error) {
    console.error('❌ Error general:', error);
    return {
      success: false,
      error: error.message,
      empresas: 0,
      muestras: 0,
      catadores: 0,
      details: []
    };
  }
}

// Función para obtener información detallada de las tablas
export async function inspectDatabaseSchema() {
  console.log('🔍 INSPECCIÓN COMPLETA DE BASE DE DATOS');
  console.log('═══════════════════════════════════════');
  
  const tables = ['empresas', 'muestras', 'catadores', 'catas', 'mesas'];
  const inspection = {};
  
  for (const table of tables) {
    inspection[table] = await getTableInfo(table);
  }
  
  return inspection;
}

// Función para limpiar datos
export async function clearSampleData() {
  try {
    console.log('🧹 Limpiando datos de prueba...');
    const results = [];
    
    const tables = ['catadores', 'muestras', 'empresas'];
    
    for (const table of tables) {
      try {
        // Intentar eliminar registros que parezcan de prueba
        const deletePatterns = [
          { name: { ilike: '%test%' } },
          { nombre: { ilike: '%test%' } },
          { email: { ilike: '%test%' } },
          { codigo: { ilike: 'TEST%' } }
        ];
        
        let deletedCount = 0;
        
        for (const pattern of deletePatterns) {
          try {
            const { error, count } = await supabase
              .from(table)
              .delete()
              .match(pattern);
            
            if (!error && count) {
              deletedCount += count;
            }
          } catch {
            // Ignorar errores de patrones que no existen
          }
        }
        
        results.push(`${table}: ${deletedCount} registros de prueba eliminados`);
        
      } catch (err) {
        results.push(`${table}: Error - ${err.message}`);
      }
    }
    
    console.log('Resultados de limpieza:', results);
    return { success: true, details: results };
    
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
    return { success: false, error: error.message };
  }
}