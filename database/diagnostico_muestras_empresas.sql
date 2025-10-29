-- Script de diagnóstico para verificar relación muestras-empresas
-- Ejecutar en Supabase SQL Editor para ver la estructura actual

-- 1. Ver estructura de tabla muestras
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'muestras'
ORDER BY 
    ordinal_position;

-- 2. Ver estructura de tabla empresas
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'empresas'
ORDER BY 
    ordinal_position;

-- 3. Ver estructura de tabla empresa_muestras (si existe)
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'empresa_muestras'
ORDER BY 
    ordinal_position;

-- 4. Ver foreign keys de empresa_muestras
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'empresa_muestras';

-- 5. Contar registros en cada tabla
SELECT 'muestras' as tabla, COUNT(*) as total FROM muestras
UNION ALL
SELECT 'empresas' as tabla, COUNT(*) as total FROM empresas
UNION ALL
SELECT 'empresa_muestras' as tabla, COUNT(*) as total FROM empresa_muestras;

-- 6. Ver si hay políticas RLS activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM 
    pg_policies
WHERE 
    tablename IN ('muestras', 'empresas', 'empresa_muestras');

-- 7. Ver ejemplo de datos con relación
SELECT 
    m.id as muestra_id,
    m.nombre as muestra_nombre,
    m.codigo as muestra_codigo,
    em.empresa_id,
    e.nombre as empresa_nombre
FROM 
    muestras m
LEFT JOIN 
    empresa_muestras em ON m.id = em.muestra_id
LEFT JOIN 
    empresas e ON em.empresa_id = e.id
LIMIT 10;

-- 8. Verificar si hay muestras sin empresa asignada
SELECT 
    m.id,
    m.nombre,
    m.codigo,
    CASE 
        WHEN em.empresa_id IS NULL THEN 'Sin empresa'
        ELSE 'Con empresa'
    END as estado_empresa
FROM 
    muestras m
LEFT JOIN 
    empresa_muestras em ON m.id = em.muestra_id;
