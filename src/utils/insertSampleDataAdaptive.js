import { supabase } from '../api/supabaseClient.js';
import bcrypt from 'bcryptjs';

// Función para inspeccionar la estructura de una tabla
async function inspectTableStructure(tableName) {
  try {
    console.log(`🔍 Inspeccionando estructura de tabla: ${tableName}`);
    
    // Obtener un registro de ejemplo para ver las columnas
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.warn(`⚠️ Error accediendo a ${tableName}:`, error.message);
      return { exists: false, columns: [], error: error.message };
    }
    
    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
    console.log(`✅ ${tableName} - Columnas encontradas:`, columns);
    
    return { exists: true, columns, sampleData: data[0] };
  } catch (err) {
    console.error(`❌ Error inspeccionando ${tableName}:`, err);
    return { exists: false, columns: [], error: err.message };
  }
}

// Función para crear datos adaptativos basados en la estructura real
function createAdaptiveData(tableName, baseData, availableColumns) {
  const adaptedData = {};
  
  // Mapear campos comunes que pueden tener diferentes nombres
  const fieldMappings = {
    empresas: {
      'name': ['nombre', 'name', 'empresa', 'razon_social'],
      'email': ['email', 'correo', 'mail'],
      'description': ['descripcion', 'description', 'notas', 'observaciones']
    },
    muestras: {
      'code': ['codigo', 'code', 'id_muestra', 'muestra_id'],
      'name': ['nombre', 'name', 'descripcion_corta'],
      'description': ['descripcion', 'description', 'notas', 'detalle']
    },
    catadores: {
      'code': ['codigo', 'code', 'id_catador'],
      'name': ['nombre', 'name', 'first_name'],
      'surname': ['apellido', 'surname', 'last_name'],
      'email': ['email', 'correo', 'mail']
    }
  };
  
  const mappings = fieldMappings[tableName] || {};
  
  Object.keys(baseData).forEach(baseField => {
    const possibleColumns = mappings[baseField] || [baseField];
    const foundColumn = possibleColumns.find(col => availableColumns.includes(col));
    
    if (foundColumn) {
      adaptedData[foundColumn] = baseData[baseField];
      console.log(`📋 ${tableName}: ${baseField} → ${foundColumn}`);
    } else {
      console.warn(`⚠️ ${tableName}: No se encontró columna para ${baseField} en ${availableColumns.join(', ')}`);
    }
  });
  
  return adaptedData;
}

export async function insertSampleData() {
  try {
    console.log('🚀 Iniciando inserción adaptativa de datos de ejemplo...');
    const results = { success: true, empresas: 0, muestras: 0, catadores: 0, errors: [] };

    // 1. Inspeccionar estructura de empresas
    const empresasStructure = await inspectTableStructure('empresas');
    
    if (empresasStructure.exists && empresasStructure.columns.length > 0) {
      console.log('📦 Intentando insertar empresas...');
      
      const empresasBase = [
        { name: 'Bodegas Rioja Alta', email: 'contacto@riojalta.com', description: 'Bodega centenaria' },
        { name: 'Vinos del Duero S.L.', email: 'info@vinosduero.es', description: 'Productores D.O. Ribera' },
        { name: 'Cellers Catalanes', email: 'ventas@cellerscatalanes.cat', description: 'Vinos del Penedès' }
      ];
      
      const empresasAdaptadas = empresasBase.map(empresa => 
        createAdaptiveData('empresas', empresa, empresasStructure.columns)
      ).filter(empresa => Object.keys(empresa).length > 0);
      
      if (empresasAdaptadas.length > 0) {
        try {
          const { data: empresasInsertadas, error: errorEmpresas } = await supabase
            .from('empresas')
            .insert(empresasAdaptadas)
            .select();

          if (errorEmpresas) {
            console.error('❌ Error insertando empresas:', errorEmpresas);
            results.errors.push(`Empresas: ${errorEmpresas.message}`);
          } else {
            results.empresas = empresasInsertadas?.length || 0;
            console.log(`✅ ${results.empresas} empresas insertadas`);
          }
        } catch (err) {
          console.error('❌ Error en inserción de empresas:', err);
          results.errors.push(`Empresas: ${err.message}`);
        }
      } else {
        results.errors.push('Empresas: No se pudieron adaptar los datos a las columnas disponibles');
      }
    } else {
      results.errors.push(`Empresas: ${empresasStructure.error || 'Tabla no accesible'}`);
    }

    // 2. Inspeccionar estructura de muestras
    const muestrasStructure = await inspectTableStructure('muestras');
    
    if (muestrasStructure.exists && muestrasStructure.columns.length > 0) {
      console.log('🍷 Intentando insertar muestras...');
      
      const muestrasBase = [
        { code: 'RJA001', name: 'Rioja Reserva 2019', description: 'Vino tinto criado 12 meses en barrica' },
        { code: 'DUE002', name: 'Ribera Crianza 2020', description: 'Vino tinto con crianza en barrica americana' },
        { code: 'CAT003', name: 'Cava Brut Reserva', description: 'Cava con crianza mínima de 15 meses' }
      ];
      
      const muestrasAdaptadas = muestrasBase.map(muestra => 
        createAdaptiveData('muestras', muestra, muestrasStructure.columns)
      ).filter(muestra => Object.keys(muestra).length > 0);
      
      if (muestrasAdaptadas.length > 0) {
        try {
          const { data: muestrasInsertadas, error: errorMuestras } = await supabase
            .from('muestras')
            .insert(muestrasAdaptadas)
            .select();

          if (errorMuestras) {
            console.error('❌ Error insertando muestras:', errorMuestras);
            results.errors.push(`Muestras: ${errorMuestras.message}`);
          } else {
            results.muestras = muestrasInsertadas?.length || 0;
            console.log(`✅ ${results.muestras} muestras insertadas`);
          }
        } catch (err) {
          console.error('❌ Error en inserción de muestras:', err);
          results.errors.push(`Muestras: ${err.message}`);
        }
      } else {
        results.errors.push('Muestras: No se pudieron adaptar los datos a las columnas disponibles');
      }
    } else {
      results.errors.push(`Muestras: ${muestrasStructure.error || 'Tabla no accesible'}`);
    }

    // 3. Inspeccionar estructura de catadores
    const catadoresStructure = await inspectTableStructure('catadores');
    
    if (catadoresStructure.exists && catadoresStructure.columns.length > 0) {
      console.log('👥 Intentando insertar catadores...');
      
      const catadoresBase = [
        { code: 'CAT001', name: 'María Elena', surname: 'Rodríguez', email: 'maria.rodriguez@catas2026.com' },
        { code: 'CAT002', name: 'Antonio', surname: 'García', email: 'antonio.garcia@catas2026.com' },
        { code: 'CAT003', name: 'Carmen', surname: 'López', email: 'carmen.lopez@catas2026.com' }
      ];
      
      // Generar contraseñas hasheadas
      const password = 'cata2026';
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      
      const catadoresAdaptados = catadoresBase.map(catador => {
        const adaptedCatador = createAdaptiveData('catadores', catador, catadoresStructure.columns);
        
        // Agregar password_hash si la columna existe
        if (catadoresStructure.columns.includes('password_hash')) {
          adaptedCatador.password_hash = password_hash;
        }
        
        return adaptedCatador;
      }).filter(catador => Object.keys(catador).length > 0);
      
      if (catadoresAdaptados.length > 0) {
        try {
          const { data: catadoresInsertados, error: errorCatadores } = await supabase
            .from('catadores')
            .insert(catadoresAdaptados)
            .select();

          if (errorCatadores) {
            console.error('❌ Error insertando catadores:', errorCatadores);
            results.errors.push(`Catadores: ${errorCatadores.message}`);
          } else {
            results.catadores = catadoresInsertados?.length || 0;
            console.log(`✅ ${results.catadores} catadores insertados`);
          }
        } catch (err) {
          console.error('❌ Error en inserción de catadores:', err);
          results.errors.push(`Catadores: ${err.message}`);
        }
      } else {
        results.errors.push('Catadores: No se pudieron adaptar los datos a las columnas disponibles');
      }
    } else {
      results.errors.push(`Catadores: ${catadoresStructure.error || 'Tabla no accesible'}`);
    }

    // Resumen final
    console.log('\n🎯 RESUMEN DE INSERCIÓN ADAPTATIVA');
    console.log('═══════════════════════════════════════');
    console.log(`📦 Empresas: ${results.empresas}`);
    console.log(`🍷 Muestras: ${results.muestras}`);
    console.log(`👥 Catadores: ${results.catadores}`);
    
    if (results.errors.length > 0) {
      console.log('\n⚠️ ERRORES ENCONTRADOS:');
      results.errors.forEach(error => console.log(`  • ${error}`));
      results.success = results.empresas > 0 || results.muestras > 0 || results.catadores > 0;
    }
    
    if (results.catadores > 0) {
      console.log('\n🔑 CREDENCIALES:');
      console.log('Contraseña para todos los catadores: cata2026');
    }

    return results;

  } catch (error) {
    console.error('❌ Error general:', error);
    return {
      success: false,
      error: error.message,
      empresas: 0,
      muestras: 0,
      catadores: 0
    };
  }
}

// Función para limpiar datos
export async function clearSampleData() {
  try {
    console.log('🧹 Limpiando datos de ejemplo...');
    const results = [];
    
    // Intentar limpiar cada tabla
    const tables = ['catadores', 'muestras', 'empresas'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).delete().neq('id', 0);
        if (error) {
          results.push(`${table}: ${error.message}`);
        } else {
          results.push(`${table}: Limpiado correctamente`);
        }
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