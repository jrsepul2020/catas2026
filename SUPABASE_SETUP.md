# Configuración de Supabase para la aplicación de catas de vino

## Pasos para configurar Supabase:

### 1. Crear proyecto en Supabase
- Ve a https://supabase.com
- Crea una nueva cuenta o inicia sesión
- Crea un nuevo proyecto
- Anota la URL y la clave anónima de tu proyecto

### 2. Configurar las variables de entorno
- Copia el archivo `.env` y actualiza las siguientes variables:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 3. Crear las tablas
- Ve al SQL Editor en tu dashboard de Supabase
- Copia y ejecuta todo el contenido del archivo `supabase-schema.sql`
- Esto creará las tablas `vinos` y `catas` con sus políticas de seguridad

### 4. Configurar autenticación (opcional)
Si quieres habilitar autenticación por email:
- Ve a Authentication > Settings en tu dashboard de Supabase
- Configura los proveedores de autenticación que desees
- Habilita "Enable email confirmations" si lo necesitas

### 5. Estructura de las tablas creadas:

#### Tabla `vinos`:
- id (UUID, primary key)
- nombre (string)
- codigo (string, unique)
- activo (boolean)
- orden (integer)
- tanda (integer)
- created_at (timestamp)
- updated_at (timestamp)

#### Tabla `catas`:
- id (UUID, primary key)
- vino_id (UUID, foreign key a vinos)
- codigo_vino (string)
- catador_numero (integer)
- vista_limpidez (integer)
- vista_color (integer)
- olfato_limpidez (integer)
- olfato_intensidad (integer)
- olfato_calidad (integer)
- sabor_limpio (integer)
- sabor_intensidad (integer)
- sabor_persistencia (integer)
- sabor_calidad (integer)
- juicio_global (integer)
- puntos_totales (integer)
- descartado (boolean)
- tanda (integer)
- orden (integer)
- created_by (string)
- created_at (timestamp)
- updated_at (timestamp)

### 6. Políticas de seguridad:
- Los vinos pueden ser leídos por todos, pero solo modificados por usuarios autenticados
- Las catas solo pueden ser vistas y modificadas por el usuario que las creó
- Row Level Security (RLS) está habilitado en ambas tablas

### 7. Datos de ejemplo:
El script incluye 5 vinos de ejemplo para que puedas probar la aplicación inmediatamente.

## Notas importantes:
- Las políticas de seguridad están configuradas para usar autenticación de Supabase
- Si no usas autenticación, deberás modificar las políticas o desactivar RLS
- Los índices están optimizados para las consultas más comunes de la aplicación