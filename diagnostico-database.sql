-- SCRIPT DE DIAGNÓSTICO - IDENTIFICAR EL PROBLEMA
-- Ejecutar este script primero para ver qué está pasando

-- 1. VER QUE TABLAS EXISTEN
SELECT 'TABLAS EXISTENTES:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 2. SI EXISTE TABLA MESAS, VER SUS COLUMNAS
SELECT 'COLUMNAS DE TABLA MESAS (si existe):' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'mesas' AND table_schema = 'public' ORDER BY ordinal_position;

-- 3. SI EXISTE TABLA CATADORES, VER SUS COLUMNAS
SELECT 'COLUMNAS DE TABLA CATADORES (si existe):' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'catadores' AND table_schema = 'public' ORDER BY ordinal_position;

-- 4. VER CONSTRAINTS EXISTENTES
SELECT 'CONSTRAINTS EXISTENTES:' as info;
SELECT constraint_name, table_name, constraint_type FROM information_schema.table_constraints 
WHERE table_schema = 'public' ORDER BY table_name;

-- 5. VER ÍNDICES EXISTENTES
SELECT 'ÍNDICES EXISTENTES:' as info;
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;

-- 6. CONTAR REGISTROS (si las tablas existen)
SELECT 'CONTEO DE REGISTROS:' as info;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'catadores') THEN
        RAISE NOTICE 'Catadores: %', (SELECT COUNT(*) FROM catadores);
    ELSE
        RAISE NOTICE 'Tabla catadores no existe';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mesas') THEN
        RAISE NOTICE 'Mesas: %', (SELECT COUNT(*) FROM mesas);
    ELSE
        RAISE NOTICE 'Tabla mesas no existe';
    END IF;
END $$;

SELECT 'DIAGNÓSTICO COMPLETADO' as resultado;