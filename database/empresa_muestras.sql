-- Tabla de relación entre empresas y muestras
-- Ejecutar este script en Supabase SQL Editor si aún no existe la tabla

-- Crear tabla empresa_muestras si no existe
CREATE TABLE IF NOT EXISTS empresa_muestras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  muestra_id UUID NOT NULL REFERENCES muestras(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evitar duplicados: una muestra solo puede estar asignada una vez a una empresa
  UNIQUE(empresa_id, muestra_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_empresa_muestras_empresa ON empresa_muestras(empresa_id);
CREATE INDEX IF NOT EXISTS idx_empresa_muestras_muestra ON empresa_muestras(muestra_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE empresa_muestras ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad: permitir lectura a usuarios autenticados
CREATE POLICY IF NOT EXISTS "Permitir lectura empresa_muestras"
  ON empresa_muestras FOR SELECT
  TO authenticated
  USING (true);

-- Permitir inserción a usuarios autenticados
CREATE POLICY IF NOT EXISTS "Permitir inserción empresa_muestras"
  ON empresa_muestras FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Permitir actualización a usuarios autenticados
CREATE POLICY IF NOT EXISTS "Permitir actualización empresa_muestras"
  ON empresa_muestras FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir eliminación a usuarios autenticados
CREATE POLICY IF NOT EXISTS "Permitir eliminación empresa_muestras"
  ON empresa_muestras FOR DELETE
  TO authenticated
  USING (true);

-- Comentarios para documentación
COMMENT ON TABLE empresa_muestras IS 'Relación muchos a muchos entre empresas y muestras de vino';
COMMENT ON COLUMN empresa_muestras.empresa_id IS 'ID de la empresa productora';
COMMENT ON COLUMN empresa_muestras.muestra_id IS 'ID de la muestra de vino';
