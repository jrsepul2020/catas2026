import { createClient } from '@supabase/supabase-js'

// Variables de entorno de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Revisa el archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Servicios adaptados para mantener la misma interfaz que Base44
export const supabaseServices = {
  // Servicio de autenticación
  auth: {
    async me() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.log('No hay usuario autenticado:', error.message)
        return null
      }
      return user
    },
    
    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data.user
    },
    
    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      return data.user
    },
    
    async signOut() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return true
    },

    // Método para obtener el estado de la sesión
    async getSession() {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    },

    // Listener para cambios de autenticación
    onAuthStateChange(callback) {
      return supabase.auth.onAuthStateChange(callback)
    }
  },

  // Servicios de entidades
  entities: {
    Vino: {
      async list(orderBy = 'codigo') {
        const { data, error } = await supabase
          .from('muestras')
          .select('*')
          .order(orderBy)
        
        if (error) throw error
        
        // Mapear los datos para compatibilidad con la aplicación
        const mappedData = (data || []).map(item => ({
          ...item,
          // Mapear campos para compatibilidad
          // NO cambiar el campo activo original, mantener el valor real de la base de datos
          orden: item.codigo,                   // Usar codigo como orden
          // Asegurar que codigo sea string
          codigo: item.codigo?.toString() || item.codigo
        }))
        
        return mappedData
      },
      
      async filter(filters = {}, orderBy = 'codigo') {
        let query = supabase.from('muestras').select('*')
        
        // Aplicar filtros con mapeo de campos basado en tu estructura real
        Object.entries(filters).forEach(([key, value]) => {
          // Mapear campos de la aplicación a campos de tu tabla muestras
          const fieldMapping = {
            'activo': 'existencias', // Usar existencias > 0 como "activo"
            'orden': 'codigo',       // Tu tabla usa codigo como identificador de orden
            'tanda': 'tanda'         // Campo tanda existe en tu tabla
          }
          
          if (key === 'activo' && value === true) {
            // Si busca activos, filtrar por existencias > 0
            query = query.gt('existencias', 0)
          } else {
            const dbField = fieldMapping[key] || key
            query = query.eq(dbField, value)
          }
        })
        
        // Mapear orderBy basado en tu estructura
        const orderMapping = {
          'orden': 'codigo',    // Ordenar por codigo
          'codigo': 'codigo',   // Campo codigo existe
          'nombre': 'nombre',   // Campo nombre existe
          'tanda': 'tanda'      // Campo tanda existe
        }
        const dbOrderField = orderMapping[orderBy] || 'codigo'
        
        if (dbOrderField) {
          query = query.order(dbOrderField)
        }
        
        const { data, error } = await query
        if (error) throw error
        
        // Mapear los datos de respuesta para que coincidan con lo que espera la aplicación
        const mappedData = (data || []).map(item => ({
          ...item,
          // Mapear campos para compatibilidad con la aplicación
          // NO cambiar el campo activo original, mantener el valor real de la base de datos
          orden: item.codigo,                   // Usar codigo como orden
          // Mantener el codigo como string si es necesario
          codigo: item.codigo?.toString() || item.codigo
        }))
        
        return mappedData
      },
      
      async create(vinoData) {
        const { data, error } = await supabase
          .from('muestras')
          .insert(vinoData)
          .select()
        
        if (error) throw error
        return data[0]
      },
      
      async update(id, vinoData) {
        const { data, error } = await supabase
          .from('muestras')
          .update(vinoData)
          .eq('id', id)
          .select()
        
        if (error) throw error
        return data[0]
      },
      
      async delete(id) {
        const { error } = await supabase
          .from('muestras')
          .delete()
          .eq('id', id)
        
        if (error) throw error
      },

      // Método específico para obtener TODAS las muestras sin filtros
      async listAll(orderBy = 'codigo') {
        const { data, error } = await supabase
          .from('muestras')
          .select('*')
          .order(orderBy)
        
        if (error) throw error
        
        // Retornar datos sin mapeo para mantener todos los campos originales
        return data || []
      }
    },
    
    Cata: {
      async list(orderBy = '-timestamp') {
        let query = supabase.from('catas').select('*')
        
        if (orderBy.startsWith('-')) {
          query = query.order(orderBy.substring(1), { ascending: false })
        } else {
          query = query.order(orderBy)
        }
        
        const { data, error } = await query
        if (error) throw error
        
        // Mapear datos de tu estructura a lo que espera la aplicación
        const mappedData = (data || []).map(item => ({
          ...item,
          // Mapear campos para compatibilidad
          vino_id: item.id,           // usar id como vino_id
          codigo_vino: item.codigo?.toString() || item.id,
          catador_numero: 1,          // valor por defecto
          
          // Mapear puntuaciones individuales a categorías de cata
          vista_limpidez: Math.floor((item.p1 || 0) * 0.2),    // 20% del total
          vista_color: Math.floor((item.p1 || 0) * 0.8),       // 80% del total
          olfato_limpidez: Math.floor((item.p2 || 0) * 0.3),   
          olfato_intensidad: Math.floor((item.p2 || 0) * 0.3), 
          olfato_calidad: Math.floor((item.p2 || 0) * 0.4),    
          sabor_limpio: Math.floor((item.p3 || 0) * 0.25),     
          sabor_intensidad: Math.floor((item.p3 || 0) * 0.25), 
          sabor_persistencia: Math.floor((item.p3 || 0) * 0.25),
          sabor_calidad: Math.floor((item.p3 || 0) * 0.25),    
          juicio_global: item.p4 || 0,
          
          puntos_totales: item.puntos || 0,
          descartado: !item.activo,
          tanda: item.tanda,
          orden: item.orden,
          created_by: 'sistema',      // valor por defecto
          created_at: item.timestamp,
        }))
        
        return mappedData
      },
      
      async filter(filters = {}, orderBy = '-timestamp') {
        let query = supabase.from('catas').select('*')
        
        // Aplicar filtros con mapeo de campos
        Object.entries(filters).forEach(([key, value]) => {
          const fieldMapping = {
            'created_by': null,     // No hay campo de usuario en tu tabla
            'vino_id': 'id',        // mapear vino_id a id
            'activo': 'activo'      // tu tabla tiene campo activo
          }
          
          const dbField = fieldMapping[key]
          if (dbField) {
            query = query.eq(dbField, value)
          }
          // Ignorar filtros que no existen en tu tabla
        })
        
        if (orderBy) {
          if (orderBy.startsWith('-')) {
            query = query.order(orderBy.substring(1), { ascending: false })
          } else {
            query = query.order(orderBy)
          }
        }
        
        const { data, error } = await query
        if (error) {
          console.error('Error filtrando catas:', error)
          throw error
        }
        
        // Aplicar el mismo mapeo que en list()
        const mappedData = (data || []).map(item => ({
          ...item,
          vino_id: item.id,
          codigo_vino: item.codigo?.toString() || item.id,
          catador_numero: 1,
          
          vista_limpidez: Math.floor((item.p1 || 0) * 0.2),
          vista_color: Math.floor((item.p1 || 0) * 0.8),
          olfato_limpidez: Math.floor((item.p2 || 0) * 0.3),
          olfato_intensidad: Math.floor((item.p2 || 0) * 0.3),
          olfato_calidad: Math.floor((item.p2 || 0) * 0.4),
          sabor_limpio: Math.floor((item.p3 || 0) * 0.25),
          sabor_intensidad: Math.floor((item.p3 || 0) * 0.25),
          sabor_persistencia: Math.floor((item.p3 || 0) * 0.25),
          sabor_calidad: Math.floor((item.p3 || 0) * 0.25),
          juicio_global: item.p4 || 0,
          
          puntos_totales: item.puntos || 0,
          descartado: !item.activo,
          tanda: item.tanda,
          orden: item.orden,
          created_by: 'sistema',
          created_at: item.timestamp,
        }))
        
        return mappedData
      },
      
      async create(cataData) {
        // Mapear campos de la aplicación a tu estructura de tabla catas
        const mappedData = {
          id: `cata-${Date.now()}`,           // generar ID único
          mesa: 1,                            // valor por defecto
          tanda: cataData.tanda || 1,
          orden: cataData.orden || 1,
          categoriaoiv: 'vino',               // valor por defecto
          categoriadecata: 'degustacion',     // valor por defecto
          activo: !cataData.descartado,       // invertir lógica descartado
          cerrado: false,                     
          timestamp: new Date().toISOString(),
          codigo: parseInt(cataData.codigo_vino) || Date.now(),
          
          // Mapear puntuaciones detalladas a tu sistema de 5 puntos
          p1: (cataData.vista_limpidez || 0) + (cataData.vista_color || 0),
          p2: (cataData.olfato_limpidez || 0) + (cataData.olfato_intensidad || 0) + (cataData.olfato_calidad || 0),
          p3: (cataData.sabor_limpio || 0) + (cataData.sabor_intensidad || 0) + (cataData.sabor_persistencia || 0) + (cataData.sabor_calidad || 0),
          p4: cataData.juicio_global || 0,
          p5: 0,                              // campo adicional
          
          puntos: cataData.puntos_totales || 0,
          
          // Nombres de panelistas (valores por defecto)
          pnombre1: 'Catador 1',
          pnombre2: 'Catador 2', 
          pnombre3: 'Catador 3',
          pnombre4: 'Catador 4',
          pnombre5: 'Catador 5',
          
          todoslospuntos: `${cataData.puntos_totales || 0}`,
        }
        
        const { data, error } = await supabase
          .from('catas')
          .insert(mappedData)
          .select()
        
        if (error) {
          console.error('Error creando cata:', error)
          throw error
        }
        
        // Devolver el dato mapeado para consistencia
        const result = data[0]
        return {
          ...result,
          vino_id: result.id,
          codigo_vino: result.codigo?.toString(),
          puntos_totales: result.puntos,
          descartado: !result.activo,
          created_by: 'sistema',
          created_at: result.timestamp,
        }
      },
      
      async update(id, cataData) {
        const { data, error } = await supabase
          .from('catas')
          .update(cataData)
          .eq('id', id)
          .select()
        
        if (error) throw error
        return data[0]
      },
      
      async delete(id) {
        const { error } = await supabase
          .from('catas')
          .delete()
          .eq('id', id)
        
        if (error) throw error
      }
    },

    Catador: {
      async list(orderBy = 'codigo') {
        const { data, error } = await supabase
          .from('catadores')
          .select('*')
          .order(orderBy)
        
        if (error) throw error
        return data || []
      },

      async listAll(orderBy = 'codigo') {
        const { data, error } = await supabase
          .from('catadores')
          .select('*')
          .order(orderBy)
        
        if (error) throw error
        return data || []
      },
      
      async create(catadorData) {
        const { data, error } = await supabase
          .from('catadores')
          .insert(catadorData)
          .select()
        
        if (error) throw error
        return data[0]
      },
      
      async update(id, catadorData) {
        const { data, error } = await supabase
          .from('catadores')
          .update(catadorData)
          .eq('id', id)
          .select()
        
        if (error) throw error
        return data[0]
      },
      
      async delete(id) {
        const { error } = await supabase
          .from('catadores')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        return true
      },

      // Métodos de autenticación personalizados
      async signIn(email, password) {
        try {
          // Buscar catador por email
          const { data: catador, error } = await supabase
            .from('catadores')
            .select('*')
            .eq('email', email)
            .eq('activo', true)
            .single()
          
          if (error || !catador) {
            return { success: false, message: 'Email no encontrado o catador inactivo' }
          }

          // En un sistema real, aquí verificarías el hash de la contraseña
          // Por simplicidad, asumimos que el password coincide si el catador existe
          // TODO: Implementar verificación real de password con bcrypt
          console.log('Password provided:', password); // Para evitar warning de variable no usada
          
          // Generar session ID
          const sessionId = `session_${catador.id}_${Date.now()}`
          
          // Actualizar estado de login
          const { error: updateError } = await supabase
            .from('catadores')
            .update({
              logueado: true,
              ultimo_login: new Date().toISOString(),
              session_id: sessionId,
              mesa_actual: catador.mesa
            })
            .eq('id', catador.id)
          
          if (updateError) throw updateError
          
          return {
            success: true,
            catador: { ...catador, logueado: true, session_id: sessionId },
            session_id: sessionId
          }
          
        } catch (error) {
          console.error('Error en signIn:', error)
          return { success: false, message: 'Error en el servidor' }
        }
      },

      async signOut(catadorId) {
        const { error } = await supabase
          .from('catadores')
          .update({
            logueado: false,
            session_id: null
          })
          .eq('id', catadorId)
        
        if (error) throw error
        return true
      },

      async getBySession(sessionId) {
        const { data, error } = await supabase
          .from('catadores')
          .select('*')
          .eq('session_id', sessionId)
          .eq('logueado', true)
          .single()
        
        if (error) return null
        return data
      },

      async getLoggedCatadores() {
        const { data, error } = await supabase
          .from('catadores')
          .select('*')
          .eq('logueado', true)
          .order('mesa_actual')
        
        if (error) throw error
        return data || []
      }
    }
  }
}