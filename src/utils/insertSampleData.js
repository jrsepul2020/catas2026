import { supabase } from '../api/supabaseClient.js';
import bcrypt from 'bcryptjs';

// Datos de ejemplo para empresas
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
    activo: true,
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
    activo: true,
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
    activo: true,
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
    activo: true,
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
    activo: true,
    notas: 'Especialistas en Albariño D.O. Rías Baixas'
  }
];

// Datos de ejemplo para muestras
const muestrasData = [
  {
    codigo: 'RJA001',
    nombre: 'Rioja Reserva 2019',
    empresa_id: null, // Se asignará después de insertar empresas
    variedad: 'Tempranillo',
    denominacion: 'D.O.Ca. Rioja',
    cosecha: 2019,
    grado_alcoholico: 14.5,
    precio: 25.90,
    existencias: 120,
    descripcion: 'Vino tinto criado 12 meses en barrica de roble francés',
    notas_cata: 'Color rojo cereza, aromas a frutos rojos maduros con notas de vainilla',
    maridaje: 'Carnes rojas, quesos curados, legumbres',
    temperatura_servicio: 16,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    codigo: 'DUE002',
    nombre: 'Ribera Crianza 2020',
    empresa_id: null,
    variedad: 'Tinta del País',
    denominacion: 'D.O. Ribera del Duero',
    cosecha: 2020,
    grado_alcoholico: 13.8,
    precio: 18.50,
    existencias: 85,
    descripcion: 'Vino tinto con crianza de 12 meses en barrica americana',
    notas_cata: 'Intenso color granate, aromas frutales con toques especiados',
    maridaje: 'Asados, caza menor, embutidos',
    temperatura_servicio: 17,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    codigo: 'CAT003',
    nombre: 'Cava Brut Reserva',
    empresa_id: null,
    variedad: 'Macabeo, Xarel·lo, Parellada',
    denominacion: 'D.O. Cava',
    cosecha: 2021,
    grado_alcoholico: 11.5,
    precio: 12.75,
    existencias: 200,
    descripcion: 'Cava con crianza mínima de 15 meses',
    notas_cata: 'Burbuja fina, aromas florales y cítricos, fresco y equilibrado',
    maridaje: 'Aperitivos, mariscos, pescados blancos',
    temperatura_servicio: 6,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    codigo: 'AND004',
    nombre: 'Fino La Palma',
    empresa_id: null,
    variedad: 'Palomino Fino',
    denominacion: 'D.O. Jerez-Xérès-Sherry',
    cosecha: 2022,
    grado_alcoholico: 15.0,
    precio: 8.90,
    existencias: 150,
    descripcion: 'Vino generoso criado bajo velo de flor',
    notas_cata: 'Color dorado pálido, aromas almendrados, seco y salino',
    maridaje: 'Jamón ibérico, aceitunas, mariscos',
    temperatura_servicio: 8,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    codigo: 'GAL005',
    nombre: 'Albariño Pazo Real',
    empresa_id: null,
    variedad: 'Albariño',
    denominacion: 'D.O. Rías Baixas',
    cosecha: 2023,
    grado_alcoholico: 12.5,
    precio: 16.20,
    existencias: 95,
    descripcion: 'Vino blanco fermentado en depósito de acero inoxidable',
    notas_cata: 'Color amarillo pajizo, aromas florales y cítricos, fresco y mineral',
    maridaje: 'Pulpo, percebes, empanada gallega',
    temperatura_servicio: 10,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    codigo: 'RJA006',
    nombre: 'Garnacha Joven 2023',
    empresa_id: null,
    variedad: 'Garnacha',
    denominacion: 'D.O.Ca. Rioja',
    cosecha: 2023,
    grado_alcoholico: 13.2,
    precio: 9.85,
    existencias: 180,
    descripcion: 'Vino tinto joven sin crianza en madera',
    notas_cata: 'Color violáceo, aromas frutales intensos, ligero y afrutado',
    maridaje: 'Tapas, pizza, pasta con tomate',
    temperatura_servicio: 14,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    codigo: 'DUE007',
    nombre: 'Rosado Premium',
    empresa_id: null,
    variedad: 'Tempranillo',
    denominacion: 'D.O. Ribera del Duero',
    cosecha: 2023,
    grado_alcoholico: 12.8,
    precio: 11.40,
    existencias: 75,
    descripcion: 'Vino rosado elaborado por sangrado',
    notas_cata: 'Color rosa frambuesa, aromas a frutos rojos, fresco y equilibrado',
    maridaje: 'Ensaladas, sushi, comida asiática',
    temperatura_servicio: 8,
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    codigo: 'CAT008',
    nombre: 'Moscatel Dulce',
    empresa_id: null,
    variedad: 'Moscatel de Alejandría',
    denominacion: 'D.O. Valencia',
    cosecha: 2022,
    grado_alcoholico: 15.5,
    precio: 22.30,
    existencias: 45,
    descripcion: 'Vino dulce natural de Moscatel',
    notas_cata: 'Color dorado brillante, aromas florales intensos, dulce y aromático',
    maridaje: 'Postres, foie gras, quesos azules',
    temperatura_servicio: 12,
    activo: true,
    created_at: new Date().toISOString()
  }
];

// Datos de ejemplo para catadores
const catadoresData = [
  {
    codigo: 'CAT001',
    nombre: 'María Elena',
    apellido: 'Rodríguez Vázquez',
    email: 'maria.rodriguez@catas2026.com',
    telefono: '645-123-456',
    especialidad: 'Vinos Tintos',
    nivel: 'Sommelier Certificado',
    años_experiencia: 12,
    certificaciones: 'WSET Level 3, Court of Master Sommeliers Level 2',
    mesa: 1,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Especialista en vinos de Rioja y Ribera del Duero'
  },
  {
    codigo: 'CAT002',
    nombre: 'Antonio',
    apellido: 'García Martín',
    email: 'antonio.garcia@catas2026.com',
    telefono: '678-234-567',
    especialidad: 'Vinos Blancos',
    nivel: 'Enólogo',
    años_experiencia: 8,
    certificaciones: 'Licenciado en Enología, WSET Level 2',
    mesa: 1,
    activo: true,
    logueado: false,
    created_at: new Date().toISOString(),
    notas: 'Experto en vinos de Rías Baixas y Penedès'
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