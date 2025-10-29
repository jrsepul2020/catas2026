import { supabase } from '../api/supabaseClient.js';

/**
 * Diagnóstico exhaustivo de la tabla empresas
 * Identifica exactamente qué campos necesita la tabla
 */
export async function diagnoseEmpresasTable() {
  console.log('🔬 DIAGNÓSTICO EXHAUSTIVO DE TABLA EMPRESAS');
  console.log('═══════════════════════════════════════════════');
  
  const diagnosticResults = {
    tableExists: false,
    canRead: false,
    existingColumns: [],
    requiredFields: [],
    workingFieldCombination: null,
    errors: []
  };

  // TEST 1: Verificar si la tabla existe y se puede leer
  console.log('\n📋 Test 1: Verificar acceso a tabla...');
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accediendo a tabla:', error.message);
      diagnosticResults.errors.push(`Acceso: ${error.message}`);
    } else {
      diagnosticResults.tableExists = true;
      diagnosticResults.canRead = true;
      
      if (data && data.length > 0) {
        diagnosticResults.existingColumns = Object.keys(data[0]);
        console.log('✅ Tabla accesible. Columnas detectadas:', diagnosticResults.existingColumns);
      } else {
        console.log('⚠️ Tabla vacía. Intentando detectar columnas por otro método...');
      }
    }
  } catch (err) {
    console.log('❌ Excepción al acceder:', err.message);
    diagnosticResults.errors.push(`Excepción: ${err.message}`);
  }

  // TEST 2: Probar inserción vacía para ver campos requeridos
  console.log('\n📋 Test 2: Detectar campos requeridos (inserción vacía)...');
  try {
    const { error } = await supabase
      .from('empresas')
      .insert({})
      .select();
    
    if (error) {
      console.log('📝 Mensaje de error:', error.message);
      
      // Analizar mensaje de error para encontrar campos requeridos
      const errorMsg = error.message.toLowerCase();
      
      // Patrones comunes de PostgreSQL
      const patterns = [
        /null value in column "([^"]+)"/g,
        /column "([^"]+)" violates not-null constraint/g,
        /column "([^"]+)" of relation/g,
        /new row for relation .* violates check constraint/g
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(errorMsg)) !== null) {
          if (match[1] && !diagnosticResults.requiredFields.includes(match[1])) {
            diagnosticResults.requiredFields.push(match[1]);
          }
        }
      });
      
      console.log('📌 Campos requeridos detectados:', diagnosticResults.requiredFields);
    }
  } catch (err) {
    console.log('⚠️ Error en inserción vacía:', err.message);
  }

  // TEST 3: Probar combinaciones de campos comunes
  console.log('\n📋 Test 3: Probar combinaciones de campos...');
  
  const fieldCombinations = [
    // Combinaciones simples
    { nombre: 'Test Empresa' },
    { name: 'Test Empresa' },
    { empresa: 'Test Empresa' },
    { razon_social: 'Test Empresa S.L.' },
    { denominacion: 'Test Empresa' },
    
    // Con email
    { nombre: 'Test Empresa', email: 'test@empresa.com' },
    { name: 'Test Empresa', email: 'test@empresa.com' },
    { empresa: 'Test Empresa', email: 'test@empresa.com' },
    { razon_social: 'Test Empresa', email: 'test@empresa.com' },
    
    // Con contacto
    { nombre: 'Test Empresa', contacto: 'test@empresa.com' },
    { empresa: 'Test Empresa', contacto: 'test@empresa.com' },
    
    // Variantes con teléfono
    { nombre: 'Test Empresa', telefono: '123456789' },
    { nombre: 'Test Empresa', email: 'test@empresa.com', telefono: '123456789' },
    
    // Variantes con dirección
    { nombre: 'Test Empresa', direccion: 'Calle Test 123' },
    { nombre: 'Test Empresa', email: 'test@empresa.com', direccion: 'Calle Test 123' },
    
    // Combinaciones en inglés
    { company_name: 'Test Empresa' },
    { business_name: 'Test Empresa' },
    { company_name: 'Test Empresa', contact_email: 'test@empresa.com' },
    
    // Combinaciones con todos los campos posibles
    { 
      nombre: 'Test Empresa',
      email: 'test@empresa.com',
      telefono: '123456789',
      direccion: 'Calle Test 123',
      cif: 'A12345678',
      contacto: 'Juan Pérez'
    },
    {
      empresa: 'Test Empresa',
      email: 'test@empresa.com',
      telefono: '123456789',
      direccion: 'Calle Test 123'
    },
    {
      razon_social: 'Test Empresa S.L.',
      email: 'test@empresa.com',
      telefono: '123456789',
      direccion: 'Calle Test 123',
      cif: 'A12345678'
    }
  ];

  for (let i = 0; i < fieldCombinations.length; i++) {
    const fields = fieldCombinations[i];
    const fieldNames = Object.keys(fields).join(', ');
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .insert(fields)
        .select();
      
      if (!error && data && data.length > 0) {
        console.log(`✅ ÉXITO con campos: ${fieldNames}`);
        diagnosticResults.workingFieldCombination = fields;
        
        // Eliminar el registro de prueba
        try {
          await supabase
            .from('empresas')
            .delete()
            .eq('id', data[0].id);
          console.log('🧹 Registro de prueba eliminado');
        } catch {
          console.log('⚠️ No se pudo eliminar el registro de prueba');
        }
        
        break; // Encontramos una combinación que funciona
      } else if (error) {
        console.log(`❌ Falló con {${fieldNames}}: ${error.message.substring(0, 100)}`);
      }
    } catch (err) {
      console.log(`❌ Excepción con {${fieldNames}}: ${err.message}`);
    }
    
    // Pequeña pausa entre intentos
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // TEST 4: Si se detectaron columnas existentes, usarlas
  if (diagnosticResults.existingColumns.length > 0) {
    console.log('\n📋 Test 4: Probar con columnas detectadas...');
    
    // Crear objeto con valores para todas las columnas detectadas
    const detectedFieldTest = {};
    diagnosticResults.existingColumns.forEach(col => {
      if (col !== 'id' && col !== 'created_at' && col !== 'updated_at') {
        // Asignar valores según el tipo probable del campo
        if (col.includes('email') || col.includes('correo')) {
          detectedFieldTest[col] = 'test@empresa.com';
        } else if (col.includes('telefono') || col.includes('phone')) {
          detectedFieldTest[col] = '123456789';
        } else if (col.includes('nombre') || col.includes('name') || col.includes('empresa') || col.includes('razon')) {
          detectedFieldTest[col] = 'Test Empresa';
        } else if (col.includes('direccion') || col.includes('address')) {
          detectedFieldTest[col] = 'Calle Test 123';
        } else if (col.includes('cif') || col.includes('nif') || col.includes('tax')) {
          detectedFieldTest[col] = 'A12345678';
        } else {
          detectedFieldTest[col] = 'Test';
        }
      }
    });
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .insert(detectedFieldTest)
        .select();
      
      if (!error && data && data.length > 0) {
        console.log('✅ ÉXITO con columnas detectadas:', Object.keys(detectedFieldTest));
        diagnosticResults.workingFieldCombination = detectedFieldTest;
        
        // Eliminar el registro de prueba
        try {
          await supabase
            .from('empresas')
            .delete()
            .eq('id', data[0].id);
          console.log('🧹 Registro de prueba eliminado');
        } catch {
          console.log('⚠️ No se pudo eliminar el registro de prueba');
        }
      } else if (error) {
        console.log('❌ Falló con columnas detectadas:', error.message);
      }
    } catch (err) {
      console.log('❌ Excepción con columnas detectadas:', err.message);
    }
  }

  // RESUMEN
  console.log('\n🎯 RESUMEN DEL DIAGNÓSTICO');
  console.log('═══════════════════════════════════════════════');
  console.log('Tabla existe:', diagnosticResults.tableExists ? '✅' : '❌');
  console.log('Puede leer:', diagnosticResults.canRead ? '✅' : '❌');
  console.log('Columnas detectadas:', diagnosticResults.existingColumns.length > 0 ? diagnosticResults.existingColumns.join(', ') : 'Ninguna');
  console.log('Campos requeridos:', diagnosticResults.requiredFields.length > 0 ? diagnosticResults.requiredFields.join(', ') : 'No detectados');
  console.log('Combinación exitosa:', diagnosticResults.workingFieldCombination ? JSON.stringify(diagnosticResults.workingFieldCombination) : 'No encontrada');
  
  if (diagnosticResults.errors.length > 0) {
    console.log('\n⚠️ Errores encontrados:');
    diagnosticResults.errors.forEach(err => console.log(`  - ${err}`));
  }
  
  return diagnosticResults;
}

// Función auxiliar para insertar empresa con la combinación correcta
export async function insertEmpresaWithDetectedFields(empresaData) {
  console.log('🔄 Intentando insertar empresa con campos detectados...');
  
  // Primero diagnosticar si no lo hemos hecho
  const diagnosis = await diagnoseEmpresasTable();
  
  if (!diagnosis.workingFieldCombination) {
    console.log('❌ No se pudo detectar combinación de campos válida');
    return { success: false, error: 'No se detectó combinación de campos válida' };
  }
  
  // Crear objeto con la estructura detectada
  const insertData = {};
  Object.keys(diagnosis.workingFieldCombination).forEach(key => {
    if (key.includes('nombre') || key.includes('name') || key.includes('empresa') || key.includes('razon')) {
      insertData[key] = empresaData.name || empresaData.nombre || 'Empresa Sin Nombre';
    } else if (key.includes('email') || key.includes('correo')) {
      insertData[key] = empresaData.email || 'sin-email@empresa.com';
    } else if (key.includes('telefono') || key.includes('phone')) {
      insertData[key] = empresaData.telefono || '000000000';
    } else if (key.includes('direccion') || key.includes('address')) {
      insertData[key] = empresaData.direccion || 'Dirección no especificada';
    } else {
      insertData[key] = diagnosis.workingFieldCombination[key];
    }
  });
  
  try {
    const { data, error } = await supabase
      .from('empresas')
      .insert(insertData)
      .select();
    
    if (error) {
      console.log('❌ Error insertando empresa:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Empresa insertada correctamente:', data[0]);
    return { success: true, data: data[0] };
  } catch (err) {
    console.log('❌ Excepción insertando empresa:', err.message);
    return { success: false, error: err.message };
  }
}
