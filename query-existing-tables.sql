-- Script para consultar la estructura de las tablas existentes
-- Ejecuta estos comandos en el SQL Editor de Supabase para ver la estructura

-- 1. Ver estructura de la tabla muestras
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'muestras' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Ver estructura de la tabla catas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'catas' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ver algunos registros de ejemplo de muestras
SELECT * FROM public.muestras LIMIT 5;

-- 4. Ver algunos registros de ejemplo de catas
SELECT * FROM public.catas LIMIT 5;

-- 5. Ver las relaciones/foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('muestras', 'catas');