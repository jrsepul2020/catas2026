-- Script de limpieza y recreación de tabla empresa_muestras
-- Usar SOLO si la tabla fue creada con tipos incorrectos (UUID en lugar de INTEGER)

-- ADVERTENCIA: Este script eliminará la tabla existente y todos sus datos

-- 1. Eliminar tabla si existe (con CASCADE para eliminar políticas y dependencias)
DROP TABLE IF EXISTS empresa_muestras CASCADE;

-- 2. Crear tabla con tipos correctos (INTEGER en lugar de UUID)
CREATE TABLE empresa_muestras (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  muestra_id INTEGER NOT NULL REFERENCES muestras(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evitar duplicados
  UNIQUE(empresa_id, muestra_id)
);

-- 3. Crear índices
CREATE INDEX idx_empresa_muestras_empresa ON empresa_muestras(empresa_id);
CREATE INDEX idx_empresa_muestras_muestra ON empresa_muestras(muestra_id);

-- 4. Habilitar RLS
ALTER TABLE empresa_muestras ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas de seguridad
CREATE POLICY "Permitir lectura empresa_muestras"
  ON empresa_muestras FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserción empresa_muestras"
  ON empresa_muestras FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir actualización empresa_muestras"
  ON empresa_muestras FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación empresa_muestras"
  ON empresa_muestras FOR DELETE
  TO authenticated
  USING (true);

-- 6. Agregar comentarios
COMMENT ON TABLE empresa_muestras IS 'Relación muchos a muchos entre empresas y muestras de vino';
COMMENT ON COLUMN empresa_muestras.empresa_id IS 'ID de la empresa productora';
COMMENT ON COLUMN empresa_muestras.muestra_id IS 'ID de la muestra de vino';

-- Verificar que se creó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'empresa_muestras'
ORDER BY 
    ordinal_position;
