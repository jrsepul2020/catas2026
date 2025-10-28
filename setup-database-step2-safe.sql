-- PASO 2 SIMPLE - SOLO COLUMNAS (SIN FOREIGN KEYS)
-- Ejecutar este archivo SI EL STEP2 ORIGINAL DA PROBLEMAS

-- 1. Agregar columnas de autenticación a catadores
DO $$ 
BEGIN 
    -- Agregar password_hash si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'password_hash') THEN
        ALTER TABLE catadores ADD COLUMN password_hash VARCHAR(255);
        RAISE NOTICE 'Columna password_hash agregada a catadores';
    END IF;

    -- Agregar activo si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'activo') THEN
        ALTER TABLE catadores ADD COLUMN activo BOOLEAN DEFAULT true;
        RAISE NOTICE 'Columna activo agregada a catadores';
    END IF;

    -- Agregar ultimo_login si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'ultimo_login') THEN
        ALTER TABLE catadores ADD COLUMN ultimo_login TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Columna ultimo_login agregada a catadores';
    END IF;

    -- Agregar session_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'session_id') THEN
        ALTER TABLE catadores ADD COLUMN session_id VARCHAR(255);
        RAISE NOTICE 'Columna session_id agregada a catadores';
    END IF;

    -- Agregar mesa_actual si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'mesa_actual') THEN
        ALTER TABLE catadores ADD COLUMN mesa_actual VARCHAR(50);
        RAISE NOTICE 'Columna mesa_actual agregada a catadores';
    END IF;

    -- Agregar logueado si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'logueado') THEN
        ALTER TABLE catadores ADD COLUMN logueado BOOLEAN DEFAULT false;
        RAISE NOTICE 'Columna logueado agregada a catadores';
    END IF;

    -- Agregar tanda_id a muestras si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'muestras' AND column_name = 'tanda_id') THEN
        ALTER TABLE muestras ADD COLUMN tanda_id INTEGER;
        RAISE NOTICE 'Columna tanda_id agregada a muestras';
    END IF;

    -- Verificar que tanda_actual_id existe en mesas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesas' AND column_name = 'tanda_actual_id') THEN
        ALTER TABLE mesas ADD COLUMN tanda_actual_id INTEGER;
        RAISE NOTICE 'Columna tanda_actual_id agregada a mesas';
    END IF;
END $$;

-- 2. Crear tabla intermedia tanda_muestras
CREATE TABLE IF NOT EXISTS tanda_muestras (
  id SERIAL PRIMARY KEY,
  tanda_id INTEGER,
  muestra_id INTEGER,
  orden_en_tanda INTEGER NOT NULL,
  mesa_asignada VARCHAR(50),
  completada BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Mensaje de confirmación
SELECT 'Paso 2 completado exitosamente - Todas las columnas agregadas' as resultado;
SELECT 'NOTA: Foreign keys se pueden agregar después si es necesario' as nota;