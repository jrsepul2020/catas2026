-- Agregar columna empresa_id a la tabla muestras
-- Ejecutar este script en Supabase SQL Editor

-- 1. Agregar la columna empresa_id
ALTER TABLE muestras 
ADD COLUMN IF NOT EXISTS empresa_id UUID;

-- 2. Agregar la foreign key constraint
ALTER TABLE muestras
ADD CONSTRAINT fk_muestras_empresa 
FOREIGN KEY (empresa_id) 
REFERENCES empresas(id) 
ON DELETE SET NULL;

-- 3. Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_muestras_empresa_id ON muestras(empresa_id);

-- 4. Verificar que se creó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'muestras' 
  AND column_name = 'empresa_id';

-- 5. Ver las columnas de muestras
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'muestras'
ORDER BY ordinal_position;
