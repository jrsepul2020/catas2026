import { supabase } from '../api/supabaseClient.js';
import bcrypt from 'bcryptjs';

// Datos de ejemplo para empresas (usando solo campos básicos)
const empresasData = [
  {
    nombre: 'Bodegas Rioja Alta',
    direccion: 'Av. Viticultores, 125',
    ciudad: 'Haro',
    provincia: 'La Rioja',
    codigo_postal: '26200',
    telefono: '941-310-346',
    email: 'contacto@riojalta.com',
    cif: 'A26123456',
    representante: 'Carlos Martínez',
    notas: 'Bodega centenaria especializada en Rioja Reserva y Gran Reserva'
  },
  {
    nombre: 'Vinos del Duero S.L.',
    direccion: 'Calle Ribera, 89',
    ciudad: 'Valladolid',
    provincia: 'Valladolid',
    codigo_postal: '47001',
    telefono: '983-456-789',
    email: 'info@vinosduero.es',
    cif: 'B47987654',
    representante: 'Ana García López',
    notas: 'Productores de vinos D.O. Ribera del Duero'
  },
  {
    nombre: 'Cellers Catalanes',
    direccion: 'Carrer del Vi, 45',
    ciudad: 'Vilafranca del Penedès',
    provincia: 'Barcelona',
    codigo_postal: '08720',
    telefono: '938-123-456',
    email: 'ventas@cellerscatalanes.cat',
    cif: 'A08345678',
    representante: 'Josep Torrents',
    notas: 'Especialistas en vinos del Penedès y cavas'
  },
  {
    nombre: 'Bodegas Andaluzas',
    direccion: 'Plaza del Jerez, 12',
    ciudad: 'Jerez de la Frontera',
    provincia: 'Cádiz',
    codigo_postal: '11400',
    telefono: '956-789-123',
    email: 'contacto@bodegasandaluzas.es',
    cif: 'A11456789',
    representante: 'Manuel Rodríguez',
    notas: 'Productores de jerez y manzanilla'
  },
  {
    nombre: 'Viñedos Gallegos S.A.',
    direccion: 'Rúa das Viñas, 78',
    ciudad: 'Cambados',
    provincia: 'Pontevedra',
    codigo_postal: '36630',
    telefono: '986-234-567',
    email: 'albariño@vinedosgallegos.com',
    cif: 'A36567890',
    representante: 'María José Santos',
    notas: 'Especialistas en Albariño D.O. Rías Baixas'
  }
];

// Datos de ejemplo para muestras (usando solo campos básicos)
const muestrasData = [
  {
    codigo: 'RJA001',
    nombre: 'Rioja Reserva 2019',
    empresa_id: null, // Se asignará después de insertar empresas
    descripcion: 'Vino tinto criado 12 meses en barrica de roble francés. Tempranillo D.O.Ca. Rioja 2019'
  },
  {
    codigo: 'DUE002',
    nombre: 'Ribera Crianza 2020',
    empresa_id: null,
    descripcion: 'Vino tinto con crianza de 12 meses en barrica americana. Tinta del País D.O. Ribera del Duero 2020'
  },
  {
    codigo: 'CAT003',
    nombre: 'Cava Brut Reserva',
    empresa_id: null,
    descripcion: 'Cava con crianza mínima de 15 meses. Macabeo, Xarel·lo, Parellada D.O. Cava 2021'
  },
  {
    codigo: 'AND004',
    nombre: 'Fino La Palma',
    empresa_id: null,
    descripcion: 'Vino generoso criado bajo velo de flor. Palomino Fino D.O. Jerez 2022'
  },
  {
    codigo: 'GAL005',
    nombre: 'Albariño Pazo Real',
    empresa_id: null,
    descripcion: 'Vino blanco fermentado en acero inoxidable. Albariño D.O. Rías Baixas 2023'
  },
  {
    codigo: 'RJA006',
    nombre: 'Garnacha Joven 2023',
    empresa_id: null,
    descripcion: 'Vino tinto joven sin crianza en madera. Garnacha D.O.Ca. Rioja 2023'
  },
  {
    codigo: 'DUE007',
    nombre: 'Rosado Premium',
    empresa_id: null,
    descripcion: 'Vino rosado elaborado por sangrado. Tempranillo D.O. Ribera del Duero 2023'
  },
  {
    codigo: 'CAT008',
    nombre: 'Moscatel Dulce',
    empresa_id: null,
    descripcion: 'Vino dulce natural de Moscatel. Moscatel de Alejandría D.O. Valencia 2022'
  }
];

// Datos de ejemplo para catadores (usando solo campos básicos)
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
    email: 'carmen.lopez@catas2026.com',
    telefono: '612-345-678',
    especialidad: 'Vinos Espumosos',
    nivel: 'Sommelier',
    años_experiencia: 15,
    certificaciones: 'Master Sommelier, Diploma WSET',
    mesa: 2,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Especialista en cavas y champagnes'
  },
  {
    codigo: 'CAT004',
    nombre: 'José Luis',
    apellido: 'Sánchez Ruiz',
    email: 'joseluis.sanchez@catas2026.com',
    telefono: '634-456-789',
    especialidad: 'Vinos Generosos',
    nivel: 'Catador Profesional',
    años_experiencia: 20,
    certificaciones: 'Consejo Regulador Jerez, WSET Level 3',
    mesa: 2,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Gran conocedor de jerez y manzanilla'
  },
  {
    codigo: 'CAT005',
    nombre: 'Laura',
    apellido: 'Jiménez Torres',
    email: 'laura.jimenez@catas2026.com',
    telefono: '667-567-890',
    especialidad: 'Vinos Dulces',
    nivel: 'Sommelier',
    años_experiencia: 6,
    certificaciones: 'WSET Level 2, Curso de Cata ICEX',
    mesa: 3,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Especialista en vinos de postre y licorosos'
  },
  {
    codigo: 'CAT006',
    nombre: 'Miguel Ángel',
    apellido: 'Moreno Silva',
    email: 'miguel.moreno@catas2026.com',
    telefono: '698-678-901',
    especialidad: 'Vinos Ecológicos',
    nivel: 'Enólogo',
    años_experiencia: 10,
    certificaciones: 'Máster en Viticultura Ecológica, WSET Level 3',
    mesa: 3,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Experto en vinos biodinámicos y naturales'
  },
  {
    codigo: 'CAT007',
    nombre: 'Isabel',
    apellido: 'Hernández Gómez',
    email: 'isabel.hernandez@catas2026.com',
    telefono: '623-789-012',
    especialidad: 'Vinos Internacionales',
    nivel: 'Master Sommelier',
    años_experiencia: 18,
    certificaciones: 'Master of Wine (candidata), CMS Advanced',
    mesa: 4,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Especialista en vinos franceses e italianos'
  },
  {
    codigo: 'CAT008',
    nombre: 'Francisco',
    apellido: 'Ruiz Castillo',
    email: 'francisco.ruiz@catas2026.com',
    telefono: '656-890-123',
    especialidad: 'Análisis Sensorial',
    nivel: 'Doctor en Enología',
    años_experiencia: 25,
    certificaciones: 'Doctorado en Enología, Investigador CSIC',
    mesa: 4,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Investigador especializado en análisis sensorial del vino'
  },
  {
    codigo: 'CAT009',
    nombre: 'Patricia',
    apellido: 'Álvarez Medina',
    email: 'patricia.alvarez@catas2026.com',
    telefono: '689-901-234',
    especialidad: 'Marketing Vinícola',
    nivel: 'Sommelier',
    años_experiencia: 7,
    certificaciones: 'WSET Level 3, MBA Sector Vinícola',
    mesa: 5,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Especialista en marketing y comunicación del vino'
  },
  {
    codigo: 'CAT010',
    nombre: 'Roberto',
    apellido: 'Díaz Serrano',
    email: 'roberto.diaz@catas2026.com',
    telefono: '612-012-345',
    especialidad: 'Viticultura',
    nivel: 'Ingeniero Agrónomo',
    años_experiencia: 14,
    certificaciones: 'Ingeniero Agrónomo, Máster en Viticultura',
    mesa: 5,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Experto en cultivo de vid y terroir'
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
      throw errorEmpresas;
    }

    console.log(`✅ ${empresasInsertadas.length} empresas insertadas correctamente`);

    // 2. Asignar empresa_id a las muestras y insertar
    console.log('🍷 Insertando muestras...');
    const muestrasConEmpresas = muestrasData.map((muestra, index) => ({
      ...muestra,
      empresa_id: empresasInsertadas[index % empresasInsertadas.length].id
    }));

    const { data: muestrasInsertadas, error: errorMuestras } = await supabase
      .from('muestras')
      .insert(muestrasConEmpresas)
      .select();

    if (errorMuestras) {
      console.error('❌ Error insertando muestras:', errorMuestras);
      throw errorMuestras;
    }

    console.log(`✅ ${muestrasInsertadas.length} muestras insertadas correctamente`);

    // 3. Generar hashes para las contraseñas de los catadores
    console.log('👥 Preparando catadores con contraseñas seguras...');
    const catadoresConPasswords = await Promise.all(
      catadoresData.map(async (catador) => {
        // Usar email como contraseña por defecto para pruebas
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
      throw errorCatadores;
    }

    console.log(`✅ ${catadoresInsertados.length} catadores insertados correctamente`);

    // Resumen
    console.log('\n🎉 INSERCIÓN COMPLETADA EXITOSAMENTE');
    console.log('═══════════════════════════════════════');
    console.log(`📦 Empresas: ${empresasInsertadas.length}`);
    console.log(`🍷 Muestras: ${muestrasInsertadas.length}`);
    console.log(`👥 Catadores: ${catadoresInsertados.length}`);
    console.log('\n🔑 CREDENCIALES DE ACCESO:');
    console.log('──────────────────────────────');
    console.log('Contraseña para todos los catadores: cata2026');
    console.log('\nEjemplos de login:');
    catadoresInsertados.slice(0, 3).forEach(catador => {
      console.log(`📧 ${catador.email} | 🔐 cata2026`);
    });
    console.log('...');

    return {
      success: true,
      empresas: empresasInsertadas.length,
      muestras: muestrasInsertadas.length,
      catadores: catadoresInsertados.length
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
    await supabase.from('catadores').delete().neq('id', 0);
    await supabase.from('muestras').delete().neq('id', 0);
    await supabase.from('empresas').delete().neq('id', 0);
    
    console.log('✅ Datos limpiados correctamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
    return { success: false, error: error.message };
  }
}