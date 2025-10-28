import { supabase } from '../api/supabaseClient';

// Script para configurar las mesas con presidente
export const setupMesasWithPresidente = async () => {
  try {
    console.log('🔧 Iniciando configuración de mesas con presidente...');

    // 1. Intentar agregar la columna presidente_id si no existe
    // Nota: Esta operación puede fallar por permisos, pero no es crítica
    try {
      // Verificar si la columna ya existe
      const { data: columns } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'mesas')
        .eq('column_name', 'presidente_id');
      
      if (!columns || columns.length === 0) {
        console.log('⚠️ Columna presidente_id no encontrada. Puede que necesite agregarse manualmente.');
      } else {
        console.log('✅ Columna presidente_id ya existe');
      }
    } catch (err) {
      console.log('⚠️ No se pudo verificar la estructura de la tabla:', err.message);
    }

    // 2. Verificar que tenemos las 5 mesas básicas
    const { data: existingMesas, error: selectError } = await supabase
      .from('mesas')
      .select('*')
      .order('numero');

    if (selectError) {
      throw new Error(`Error al consultar mesas: ${selectError.message}`);
    }

    console.log(`📊 Mesas existentes: ${existingMesas?.length || 0}`);

    // 3. Crear las 5 mesas por defecto si no existen
    if (!existingMesas || existingMesas.length === 0) {
      const defaultMesas = [];
      for (let i = 1; i <= 5; i++) {
        defaultMesas.push({
          numero: i,
          nombre: `Mesa ${i}`,
          capacidad_total: 5,
          activa: true
          // presidente_id se omite si la columna no existe aún
        });
      }

      const { data: createdMesas, error: insertError } = await supabase
        .from('mesas')
        .insert(defaultMesas)
        .select();

      if (insertError) {
        throw new Error(`Error al crear mesas por defecto: ${insertError.message}`);
      }

      console.log(`✅ Creadas ${createdMesas?.length || 0} mesas por defecto`);
    } else {
      console.log('✅ Las mesas ya están configuradas');
    }

    // 4. Verificar catadores existentes
    const { data: catadores, error: catadoresError } = await supabase
      .from('catadores')
      .select('id, nombre, email, mesa_id')
      .order('nombre');

    if (catadoresError) {
      throw new Error(`Error al consultar catadores: ${catadoresError.message}`);
    }

    console.log(`👥 Catadores disponibles: ${catadores?.length || 0}`);

    // 5. Estadísticas finales
    // Consulta simple que funciona sin columna presidente_id
    const { data: finalMesas } = await supabase
      .from('mesas')
      .select(`
        *,
        ocupantes:catadores!catadores_mesa_id_fkey(id, nombre, email)
      `)
      .order('numero');

    const stats = {
      totalMesas: finalMesas?.length || 0,
      mesasConPresidente: 0, // Se actualizará cuando se agregue la columna presidente_id
      capacidadTotal: finalMesas?.reduce((acc, m) => acc + m.capacidad_total, 0) || 0,
      ocupacionActual: finalMesas?.reduce((acc, m) => acc + (m.ocupantes?.length || 0), 0) || 0
    };

    console.log('📈 Estadísticas finales:', stats);

    return {
      success: true,
      message: 'Configuración de mesas completada exitosamente',
      stats,
      mesas: finalMesas
    };

  } catch (error) {
    console.error('❌ Error en configuración de mesas:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      error
    };
  }
};

// Función para crear mesas adicionales
export const createAdditionalMesas = async (startNumber, count = 1) => {
  try {
    const nuevasMesas = [];
    
    for (let i = 0; i < count; i++) {
      const numero = startNumber + i;
      nuevasMesas.push({
        numero,
        nombre: `Mesa ${numero}`,
        capacidad_total: 5,
        activa: true,
        presidente_id: null
      });
    }

    const { data, error } = await supabase
      .from('mesas')
      .insert(nuevasMesas)
      .select();

    if (error) throw error;

    return {
      success: true,
      message: `${count} mesa(s) creada(s) exitosamente`,
      mesas: data
    };

  } catch (error) {
    return {
      success: false,
      message: `Error al crear mesas: ${error.message}`,
      error
    };
  }
};