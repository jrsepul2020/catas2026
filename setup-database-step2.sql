-- PASO 2: AGREGAR COLUMNAS Y RELACIONES
-- Ejecutar este archivo DESPUÉS del PASO 1

-- 1. Agregar columnas de autenticación a catadores usando DO blocks para verificar
DO $$ 
BEGIN 
    -- Agregar password_hash si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'password_hash') THEN
        ALTER TABLE catadores ADD COLUMN password_hash VARCHAR(255);
    END IF;

    -- Agregar activo si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'activo') THEN
        ALTER TABLE catadores ADD COLUMN activo BOOLEAN DEFAULT true;
    END IF;

    -- Agregar ultimo_login si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'ultimo_login') THEN
        ALTER TABLE catadores ADD COLUMN ultimo_login TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Agregar session_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'session_id') THEN
        ALTER TABLE catadores ADD COLUMN session_id VARCHAR(255);
    END IF;

    -- Agregar mesa_actual si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'mesa_actual') THEN
        ALTER TABLE catadores ADD COLUMN mesa_actual VARCHAR(50);
    END IF;

    -- Agregar logueado si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'catadores' AND column_name = 'logueado') THEN
        ALTER TABLE catadores ADD COLUMN logueado BOOLEAN DEFAULT false;
    END IF;

    -- Agregar tanda_id a muestras si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'muestras' AND column_name = 'tanda_id') THEN
        ALTER TABLE muestras ADD COLUMN tanda_id INTEGER;
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

-- 4. Agregar foreign keys DESPUÉS de crear todas las tablas
-- Usar DO blocks para verificar si existen antes de crear
DO $$ 
BEGIN 
    -- Verificar que la columna tanda_actual_id existe en mesas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesas' AND column_name = 'tanda_actual_id') THEN
        RAISE NOTICE 'Columna tanda_actual_id no existe en mesas. Creándola...';
        ALTER TABLE mesas ADD COLUMN tanda_actual_id INTEGER;
    END IF;

    -- Foreign key para mesas -> tandas (solo si ambas tablas existen)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tandas') 
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mesas')
       AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                       WHERE constraint_name = 'fk_mesas_tanda' AND table_name = 'mesas') THEN
        ALTER TABLE mesas ADD CONSTRAINT fk_mesas_tanda 
          FOREIGN KEY (tanda_actual_id) REFERENCES tandas(id);
    END IF;

    -- Foreign key para catas -> catadores
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_catas_catador' AND table_name = 'catas') THEN
        ALTER TABLE catas ADD CONSTRAINT fk_catas_catador 
          FOREIGN KEY (catador_id) REFERENCES catadores(id);
    END IF;

    -- Foreign key para catas -> muestras
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_catas_muestra' AND table_name = 'catas') THEN
        ALTER TABLE catas ADD CONSTRAINT fk_catas_muestra 
          FOREIGN KEY (muestra_id) REFERENCES muestras(id);
    END IF;

    -- Foreign key para catas -> tandas
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_catas_tanda' AND table_name = 'catas') THEN
        ALTER TABLE catas ADD CONSTRAINT fk_catas_tanda 
          FOREIGN KEY (tanda_id) REFERENCES tandas(id);
    END IF;

    -- Foreign key para muestras -> tandas
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_muestras_tanda' AND table_name = 'muestras') THEN
        ALTER TABLE muestras ADD CONSTRAINT fk_muestras_tanda 
          FOREIGN KEY (tanda_id) REFERENCES tandas(id);
    END IF;

    -- Foreign key para tanda_muestras -> tandas
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_tanda_muestras_tanda' AND table_name = 'tanda_muestras') THEN
        ALTER TABLE tanda_muestras ADD CONSTRAINT fk_tanda_muestras_tanda 
          FOREIGN KEY (tanda_id) REFERENCES tandas(id) ON DELETE CASCADE;
    END IF;

    -- Foreign key para tanda_muestras -> muestras
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_tanda_muestras_muestra' AND table_name = 'tanda_muestras') THEN
        ALTER TABLE tanda_muestras ADD CONSTRAINT fk_tanda_muestras_muestra 
          FOREIGN KEY (muestra_id) REFERENCES muestras(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Confirmar que las relaciones se crearon
SELECT 'Relaciones agregadas correctamente' as mensaje;