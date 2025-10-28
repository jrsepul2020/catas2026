-- Consulta para ver la estructura de tu tabla catas
-- Ejecuta esta consulta en tu SQL Editor de Supabase

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'catas' 
    AND table_schema = 'public'
ORDER BY ordinal_position;