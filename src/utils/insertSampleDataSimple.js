import { supabase } from '../api/supabaseClient.js';
import bcrypt from 'bcryptjs';

// Datos de ejemplo simplificados para empresas (solo campos básicos)
const empresasData = [
  {
    nombre: 'Bodegas Rioja Alta',
    email: 'contacto@riojalta.com'
  },
  {
    nombre: 'Vinos del Duero S.L.',
    email: 'info@vinosduero.es'
  },
  {
    nombre: 'Cellers Catalanes',
    email: 'ventas@cellerscatalanes.cat'
  },
  {
    nombre: 'Bodegas Andaluzas',
    email: 'contacto@bodegasandaluzas.es'
  },
  {
    nombre: 'Viñedos Gallegos S.A.',
    email: 'albariño@vinedosgallegos.com'
  }
];

// Datos de ejemplo simplificados para muestras (solo campos básicos)
const muestrasData = [
  {
    codigo: 'RJA001',
    nombre: 'Rioja Reserva 2019',
    descripcion: 'Vino tinto criado 12 meses en barrica de roble francés'
  },
  {
    codigo: 'DUE002',
    nombre: 'Ribera Crianza 2020',
    descripcion: 'Vino tinto con crianza de 12 meses en barrica americana'
  },
  {
    codigo: 'CAT003',
    nombre: 'Cava Brut Reserva',
    descripcion: 'Cava con crianza mínima de 15 meses'
  },
  {
    codigo: 'AND004',
    nombre: 'Fino La Palma',
    descripcion: 'Vino generoso criado bajo velo de flor'
  },
  {
    codigo: 'GAL005',
    nombre: 'Albariño Pazo Real',
    descripcion: 'Vino blanco fermentado en acero inoxidable'
  },
  {
    codigo: 'RJA006',
    nombre: 'Garnacha Joven 2023',
    descripcion: 'Vino tinto joven sin crianza en madera'
  },
  {
    codigo: 'DUE007',
    nombre: 'Rosado Premium',
    descripcion: 'Vino rosado elaborado por sangrado'
  },
  {
    codigo: 'CAT008',
    nombre: 'Moscatel Dulce',
    descripcion: 'Vino dulce natural de Moscatel'
  }
];

// Datos de ejemplo simplificados para catadores (solo campos básicos)
const catadoresData = [
  {
    codigo: 'CAT001',
    nombre: 'María Elena',
    apellido: 'Rodríguez Vázquez',
    email: 'maria.rodriguez@catas2026.com'
  },
  {
    codigo: 'CAT002',
    nombre: 'Antonio',
    apellido: 'García Martín',
    email: 'antonio.garcia@catas2026.com'
  },
  {
    codigo: 'CAT003',
    nombre: 'Carmen',
    apellido: 'López Fernández',
    email: 'carmen.lopez@catas2026.com'
  },
  {
    codigo: 'CAT004',
    nombre: 'José Luis',
    apellido: 'Sánchez Ruiz',
    email: 'joseluis.sanchez@catas2026.com'
  },
  {
    codigo: 'CAT005',
    nombre: 'Laura',
    apellido: 'Jiménez Torres',
    email: 'laura.jimenez@catas2026.com'
  },
  {
    codigo: 'CAT006',
    nombre: 'Miguel Ángel',
    apellido: 'Moreno Silva',
    email: 'miguel.moreno@catas2026.com'
  },
  {
    codigo: 'CAT007',
    nombre: 'Isabel',
    apellido: 'Hernández Gómez',
    email: 'isabel.hernandez@catas2026.com'
  },
  {
    codigo: 'CAT008',
    nombre: 'Francisco',
    apellido: 'Ruiz Castillo',
    email: 'francisco.ruiz@catas2026.com'
  },
  {
    codigo: 'CAT009',
    nombre: 'Patricia',
    apellido: 'Álvarez Medina',
    email: 'patricia.alvarez@catas2026.com'
  },
  {
    codigo: 'CAT010',
    nombre: 'Roberto',
    apellido: 'Díaz Serrano',
    email: 'roberto.diaz@catas2026.com'
  }
];

export async function insertSampleData() {
  try {
    console.log('🚀 Iniciando inserción de datos de ejemplo...');

    // 1. Insertar empresas
    console.log('📦 Insertando empresas...');
    const { data: empresasInsertadas, error: errorEmpresas } = await supabase
      .from('empresas')
      .insert(empresasData)
      .select();

    if (errorEmpresas) {
      console.error('❌ Error insertando empresas:', errorEmpresas);
      throw new Error(`Error en empresas: ${errorEmpresas.message}`);
    }

    console.log(`✅ ${empresasInsertadas?.length || 0} empresas insertadas correctamente`);

    // 2. Insertar muestras (sin referencia a empresa por ahora)
    console.log('🍷 Insertando muestras...');
    const { data: muestrasInsertadas, error: errorMuestras } = await supabase
      .from('muestras')
      .insert(muestrasData)
      .select();

    if (errorMuestras) {
      console.error('❌ Error insertando muestras:', errorMuestras);
      throw new Error(`Error en muestras: ${errorMuestras.message}`);
    }

    console.log(`✅ ${muestrasInsertadas?.length || 0} muestras insertadas correctamente`);

    // 3. Generar hashes para las contraseñas de los catadores
    console.log('👥 Preparando catadores con contraseñas seguras...');
    const catadoresConPasswords = await Promise.all(
      catadoresData.map(async (catador) => {
        const password = 'cata2026'; // Contraseña por defecto para todos
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        return {
          ...catador,
          password_hash
        };
      })
    );

    // 4. Insertar catadores
    console.log('👥 Insertando catadores...');
    const { data: catadoresInsertados, error: errorCatadores } = await supabase
      .from('catadores')
      .insert(catadoresConPasswords)
      .select();

    if (errorCatadores) {
      console.error('❌ Error insertando catadores:', errorCatadores);
      throw new Error(`Error en catadores: ${errorCatadores.message}`);
    }

    console.log(`✅ ${catadoresInsertados?.length || 0} catadores insertados correctamente`);

    // Resumen
    console.log('\n🎉 INSERCIÓN COMPLETADA EXITOSAMENTE');
    console.log('═══════════════════════════════════════');
    console.log(`📦 Empresas: ${empresasInsertadas?.length || 0}`);
    console.log(`🍷 Muestras: ${muestrasInsertadas?.length || 0}`);
    console.log(`👥 Catadores: ${catadoresInsertados?.length || 0}`);
    console.log('\n🔑 CREDENCIALES DE ACCESO:');
    console.log('──────────────────────────────');
    console.log('Contraseña para todos los catadores: cata2026');
    
    if (catadoresInsertados && catadoresInsertados.length > 0) {
      console.log('\nEjemplos de login:');
      catadoresInsertados.slice(0, 3).forEach(catador => {
        console.log(`📧 ${catador.email} | 🔐 cata2026`);
      });
      console.log('...');
    }

    return {
      success: true,
      empresas: empresasInsertadas?.length || 0,
      muestras: muestrasInsertadas?.length || 0,
      catadores: catadoresInsertados?.length || 0
    };

  } catch (error) {
    console.error('❌ Error general:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Función para limpiar datos (útil para testing)
export async function clearSampleData() {
  try {
    console.log('🧹 Limpiando datos de ejemplo...');
    
    // Eliminar en orden inverso por las dependencias
    const { error: errorCatadores } = await supabase.from('catadores').delete().neq('id', 0);
    if (errorCatadores) console.warn('Error limpiando catadores:', errorCatadores.message);
    
    const { error: errorMuestras } = await supabase.from('muestras').delete().neq('id', 0);
    if (errorMuestras) console.warn('Error limpiando muestras:', errorMuestras.message);
    
    const { error: errorEmpresas } = await supabase.from('empresas').delete().neq('id', 0);
    if (errorEmpresas) console.warn('Error limpiando empresas:', errorEmpresas.message);
    
    console.log('✅ Datos limpiados correctamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
    return { success: false, error: error.message };
  }
}