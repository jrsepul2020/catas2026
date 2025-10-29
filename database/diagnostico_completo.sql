-- DIAGNÓSTICO COMPLETO - Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura exacta de muestras
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'muestras'
ORDER BY ordinal_position;

-- 2. Verificar foreign keys de muestras
SELECT
    tc.constraint_name,
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
    AND tc.table_name = 'muestras';

-- 3. Verificar políticas RLS de muestras
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    tablename = 'muestras';

-- 4. Probar el query que falla
SELECT 
    m.*,
    e.id as empresa_id_real,
    e.nombre as empresa_nombre
FROM 
    muestras m
LEFT JOIN 
    empresas e ON m.empresa_id = e.id
LIMIT 5;

-- 5. Verificar si hay muestras
SELECT COUNT(*) as total_muestras FROM muestras;

-- 6. Ver ejemplo de una muestra
SELECT * FROM muestras LIMIT 1;
