-- PASO 2 ALTERNATIVO (SIN FOREIGN KEYS): AGREGAR COLUMNAS
-- Ejecutar este archivo DESPUÉS del PASO 1 si el step2 original da problemas

-- 1. Agregar columnas de autenticación a catadores
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS mesa_actual VARCHAR(50);
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS logueado BOOLEAN DEFAULT false;

-- 2. Agregar relación de tanda a muestras
ALTER TABLE muestras ADD COLUMN IF NOT EXISTS tanda_id INTEGER;

-- 3. Crear tabla intermedia tanda_muestras
CREATE TABLE IF NOT EXISTS tanda_muestras (
  id SERIAL PRIMARY KEY,
  tanda_id INTEGER,
  muestra_id INTEGER,
  orden_en_tanda INTEGER NOT NULL,
  mesa_asignada VARCHAR(50),
  completada BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Confirmar que las columnas se agregaron
SELECT 'Columnas agregadas correctamente - Foreign keys se agregarán en step3' as mensaje;