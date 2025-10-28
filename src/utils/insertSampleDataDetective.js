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
      { denominacion: baseData.name || 'Test Empresa' },
      { 
        empresa: baseData.name || 'Test Empresa',
        email: baseData.email || 'test@empresa.com'
      },
      { 
        razon_social: baseData.name || 'Test Empresa S.L.',
        email: baseData.email || 'test@empresa.com'
      },
      { 
        denominacion: baseData.name || 'Test Empresa',
        email: baseData.email || 'test@empresa.com'
      },
      { 
        nombre_empresa: baseData.name || 'Test Empresa',
        email_empresa: baseData.email || 'test@empresa.com'
      },
      { 
        nombre_comercial: baseData.name || 'Test Empresa',
        contacto: baseData.email || 'test@empresa.com'
      },
      {
        company_name: baseData.name || 'Test Empresa',
        company_email: baseData.email || 'test@empresa.com'
      },
      {
        business_name: baseData.name || 'Test Empresa',
        contact_email: baseData.email || 'test@empresa.com'
      }
    ] : []),
    
    ...(tableName === 'muestras' ? [
      { muestra: baseData.name || 'Test Muestra' },
      { codigo: baseData.code || 'TEST001' },
      { id_muestra: baseData.code || 'TEST001' }
    ] : []),
    
    ...(tableName === 'catadores' ? [
      { catador: baseData.name || 'Test Catador' },
      { usuario: baseData.name || 'testuser' },
      { login: baseData.email || 'test@example.com' },
      { 
        nombre: baseData.name || 'Test',
        apellido: baseData.surname || 'Catador',
        email: baseData.email || 'test@example.com'
      },
      { 
        name: baseData.name || 'Test',
        surname: baseData.surname || 'Catador',
        email: baseData.email || 'test@example.com'
      },
      {
        nombre: baseData.name || 'Test',
        email: baseData.email || 'test@example.com',
        codigo: baseData.code || 'TEST001'
      }
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

    // Datos base expandidos para insertar más registros
    const testData = {
      empresas: [
        { name: 'Bodegas Rioja Alta', email: 'contacto@riojalta.com' },
        { name: 'Vinos del Duero S.L.', email: 'info@vinosduero.es' },
        { name: 'Cellers Catalanes', email: 'ventas@cellerscatalanes.cat' },
        { name: 'Bodegas Andaluzas', email: 'contacto@bodegasandaluzas.es' },
        { name: 'Viñedos Gallegos S.A.', email: 'albariño@vinedosgallegos.com' }
      ],
      muestras: [
        { name: 'Rioja Reserva 2019', code: 'RJA001' },
        { name: 'Ribera Crianza 2020', code: 'DUE002' },
        { name: 'Cava Brut Reserva', code: 'CAT003' },
        { name: 'Fino La Palma', code: 'AND004' },
        { name: 'Albariño Pazo Real', code: 'GAL005' },
        { name: 'Garnacha Joven 2023', code: 'RJA006' },
        { name: 'Rosado Premium', code: 'DUE007' },
        { name: 'Moscatel Dulce', code: 'CAT008' }
      ],
      catadores: [
        { name: 'María Elena', surname: 'Rodríguez Vázquez', email: 'maria.rodriguez@catas2026.com', code: 'CAT001' },
        { name: 'Antonio', surname: 'García Martín', email: 'antonio.garcia@catas2026.com', code: 'CAT002' },
        { name: 'Carmen', surname: 'López Fernández', email: 'carmen.lopez@catas2026.com', code: 'CAT003' },
        { name: 'José Luis', surname: 'Sánchez Ruiz', email: 'joseluis.sanchez@catas2026.com', code: 'CAT004' },
        { name: 'Laura', surname: 'Jiménez Torres', email: 'laura.jimenez@catas2026.com', code: 'CAT005' },
        { name: 'Miguel Ángel', surname: 'Moreno Silva', email: 'miguel.moreno@catas2026.com', code: 'CAT006' },
        { name: 'Isabel', surname: 'Hernández Gómez', email: 'isabel.hernandez@catas2026.com', code: 'CAT007' },
        { name: 'Francisco', surname: 'Ruiz Castillo', email: 'francisco.ruiz@catas2026.com', code: 'CAT008' },
        { name: 'Patricia', surname: 'Álvarez Medina', email: 'patricia.alvarez@catas2026.com', code: 'CAT009' },
        { name: 'Roberto', surname: 'Díaz Serrano', email: 'roberto.diaz@catas2026.com', code: 'CAT010' }
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
      
      // Intentar insertar todos los registros de prueba
      let successCount = 0;
      const totalAttempts = dataArray.length;
      
      console.log(`📊 ${tableName} - Intentando insertar ${totalAttempts} registros...`);
      
      for (let i = 0; i < totalAttempts; i++) {
        const baseData = dataArray[i];
        const result = await tryMinimalInsert(tableName, baseData);
        
        if (result.success) {
          successCount++;
          console.log(`✅ ${tableName} - Registro ${i + 1}/${totalAttempts} insertado: ${baseData.name || baseData.code || 'Sin nombre'}`);
        } else {
          console.log(`❌ ${tableName} - Registro ${i + 1}/${totalAttempts} falló (${baseData.name || baseData.code}): ${result.message}`);
        }
        
        // Pequeña pausa entre inserciones para evitar límites de rate
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      results[tableName] = successCount;
      
      if (successCount === 0) {
        console.log(`💥 ${tableName} - FALLO TOTAL: 0/${totalAttempts} registros insertados`);
        console.log(`🔍 ${tableName} - Info de tabla:`, JSON.stringify(tableInfo, null, 2));
        
        // Diagnóstico específico para empresas
        if (tableName === 'empresas') {
          console.log(`🏢 DIAGNÓSTICO EMPRESAS:`);
          console.log(`- Columnas detectadas:`, tableInfo.columns || 'Sin información');
          console.log(`- Método de detección:`, tableInfo.method || 'Sin método');
          console.log(`- Existe tabla:`, tableInfo.exists);
          
          // Intentar inserción diagnóstica
          try {
            const { error: diagError } = await supabase
              .from('empresas')
              .insert({ test_field: 'diagnostic' })
              .select();
            
            if (diagError) {
              console.log(`🔍 Error diagnóstico empresas:`, diagError.message);
              results.errors.push(`empresas: Error de schema - ${diagError.message}`);
            }
          } catch (err) {
            console.log(`🔍 Error en diagnóstico empresas:`, err.message);
          }
        }
        
        results.errors.push(`${tableName}: No se pudo insertar ningún registro`);
      } else if (successCount < totalAttempts) {
        results.errors.push(`${tableName}: Solo se insertaron ${successCount} de ${totalAttempts} registros`);
      } else {
        console.log(`🎉 ${tableName} - Todos los registros insertados correctamente (${successCount}/${totalAttempts})`);
      }
    }

    // Intentar añadir contraseñas a catadores si se insertaron
    if (results.catadores > 0) {
      try {
        console.log('🔐 Intentando añadir contraseñas a catadores...');
        const password = 'cata2026';
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        // Obtener catadores recién insertados que contengan 'test' o emails de ejemplo
        const { data: catadoresInsertados } = await supabase
          .from('catadores')
          .select('id')
          .or('email.ilike.%test%,email.ilike.%catas2026%,nombre.ilike.%test%');
        
        if (catadoresInsertados && catadoresInsertados.length > 0) {
          // Intentar actualizar con diferentes nombres de columna para password
          const passwordFields = ['password_hash', 'password', 'clave', 'contraseña'];
          let passwordUpdated = false;
          
          for (const field of passwordFields) {
            try {
              const { error: updateError } = await supabase
                .from('catadores')
                .update({ [field]: password_hash })
                .in('id', catadoresInsertados.map(c => c.id));
              
              if (!updateError) {
                console.log(`✅ Contraseñas añadidas usando campo: ${field}`);
                passwordUpdated = true;
                break;
              }
            } catch {
              // Intentar siguiente campo
            }
          }
          
          if (!passwordUpdated) {
            console.log('⚠️ No se pudo añadir contraseñas - campo password no encontrado');
            results.errors.push('Catadores: Contraseñas no añadidas (campo no encontrado)');
          }
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