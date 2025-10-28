-- Schema actualizado para sistema de cata con control de mesas y tandas
-- EJECUTAR PASO A PASO EN SUPABASE SQL EDITOR

-- 1. Verificar si tabla catadores existe, si no crearla
CREATE TABLE IF NOT EXISTS catadores (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  rol VARCHAR(100),
  mesa VARCHAR(50),
  tablet VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Actualizar tabla catadores para incluir autenticación
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS mesa_actual VARCHAR(50);
ALTER TABLE catadores ADD COLUMN IF NOT EXISTS logueado BOOLEAN DEFAULT false;

-- Índices adicionales para autenticación
CREATE INDEX IF NOT EXISTS idx_catadores_email ON catadores(email);
CREATE INDEX IF NOT EXISTS idx_catadores_session_id ON catadores(session_id);
CREATE INDEX IF NOT EXISTS idx_catadores_logueado ON catadores(logueado);

-- 3. Verificar si tabla muestras existe, si no crearla
CREATE TABLE IF NOT EXISTS muestras (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  categoria VARCHAR(100),
  descripcion TEXT,
  tanda VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  existencias INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla tandas
CREATE TABLE IF NOT EXISTS tandas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  hora_inicio TIME,
  hora_fin TIME,
  estado VARCHAR(50) DEFAULT 'planificada', -- planificada, en_curso, finalizada, cancelada
  
  -- Configuración de mesas
  mesas_asignadas TEXT[], -- Array de mesas asignadas
  max_mesas INTEGER DEFAULT 10,
  catadores_por_mesa INTEGER DEFAULT 4,
  
  -- Configuración de muestras
  total_muestras INTEGER DEFAULT 0,
  muestras_por_mesa INTEGER DEFAULT 10,
  
  -- Control de tiempo
  tiempo_por_muestra INTEGER DEFAULT 10, -- minutos
  descanso_entre_muestras INTEGER DEFAULT 2, -- minutos
  
  -- Metadatos
  creado_por VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para tandas
CREATE INDEX IF NOT EXISTS idx_tandas_codigo ON tandas(codigo);
CREATE INDEX IF NOT EXISTS idx_tandas_fecha_inicio ON tandas(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_tandas_estado ON tandas(estado);

-- 5. Crear tabla mesas (para control de estado)
CREATE TABLE IF NOT EXISTS mesas (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(20) UNIQUE NOT NULL, -- Mesa 1, Mesa 2, etc.
  nombre VARCHAR(255),
  capacidad INTEGER DEFAULT 4,
  activa BOOLEAN DEFAULT true,
  
  -- Estado actual
  ocupada BOOLEAN DEFAULT false,
  catadores_actuales INTEGER DEFAULT 0,
  tanda_actual_id INTEGER REFERENCES tandas(id),
  
  -- Configuración física
  ubicacion VARCHAR(255),
  equipamiento TEXT, -- tablets, copas, etc.
  observaciones TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mesas
CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);
CREATE INDEX IF NOT EXISTS idx_mesas_activa ON mesas(activa);
CREATE INDEX IF NOT EXISTS idx_mesas_tanda_actual ON mesas(tanda_actual_id);

-- 6. Crear tabla intermedia tanda_muestras
CREATE TABLE IF NOT EXISTS tanda_muestras (
  id SERIAL PRIMARY KEY,
  tanda_id INTEGER REFERENCES tandas(id) ON DELETE CASCADE,
  muestra_id INTEGER REFERENCES muestras(id) ON DELETE CASCADE,
  orden_en_tanda INTEGER NOT NULL,
  mesa_asignada VARCHAR(50),
  completada BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tanda_id, muestra_id),
  UNIQUE(tanda_id, orden_en_tanda)
);

-- Índices para tanda_muestras
CREATE INDEX IF NOT EXISTS idx_tanda_muestras_tanda ON tanda_muestras(tanda_id);
CREATE INDEX IF NOT EXISTS idx_tanda_muestras_muestra ON tanda_muestras(muestra_id);
CREATE INDEX IF NOT EXISTS idx_tanda_muestras_mesa ON tanda_muestras(mesa_asignada);

-- 7. Actualizar tabla muestras para incluir información de tanda
ALTER TABLE muestras ADD COLUMN IF NOT EXISTS tanda_id INTEGER REFERENCES tandas(id);
CREATE INDEX IF NOT EXISTS idx_muestras_tanda_id ON muestras(tanda_id);

-- 8. Crear tabla catas si no existe
CREATE TABLE IF NOT EXISTS catas (
  id SERIAL PRIMARY KEY,
  catador_id INTEGER REFERENCES catadores(id),
  muestra_id INTEGER REFERENCES muestras(id),
  tanda_id INTEGER REFERENCES tandas(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evaluación visual
  color VARCHAR(100),
  intensidad_color INTEGER CHECK (intensidad_color >= 1 AND intensidad_color <= 10),
  limpidez VARCHAR(100),
  
  -- Evaluación olfativa  
  intensidad_aromatica INTEGER CHECK (intensidad_aromatica >= 1 AND intensidad_aromatica <= 10),
  aromas TEXT,
  
  -- Evaluación gustativa
  dulzor INTEGER CHECK (dulzor >= 1 AND dulzor <= 10),
  acidez INTEGER CHECK (acidez >= 1 AND acidez <= 10),
  taninos INTEGER CHECK (taninos >= 1 AND taninos <= 10),
  alcohol INTEGER CHECK (alcohol >= 1 AND alcohol <= 10),
  cuerpo INTEGER CHECK (cuerpo >= 1 AND cuerpo <= 10),
  sabores TEXT,
  
  -- Evaluación final
  persistencia INTEGER CHECK (persistencia >= 1 AND persistencia <= 10),
  calidad_general INTEGER CHECK (calidad_general >= 1 AND calidad_general <= 100),
  notas TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Datos de ejemplo

-- Insertar mesas de ejemplo
INSERT INTO mesas (numero, nombre, capacidad, ubicacion) VALUES
('Mesa 1', 'Mesa Principal 1', 4, 'Sala Norte'),
('Mesa 2', 'Mesa Principal 2', 4, 'Sala Norte'),
('Mesa 3', 'Mesa Principal 3', 4, 'Sala Centro'),
('Mesa 4', 'Mesa Principal 4', 4, 'Sala Centro'),
('Mesa 5', 'Mesa Principal 5', 4, 'Sala Sur')
ON CONFLICT (numero) DO NOTHING;

-- Insertar tanda de ejemplo
INSERT INTO tandas (codigo, nombre, descripcion, fecha_inicio, estado, mesas_asignadas, total_muestras) VALUES
('TANDA_2024_001', 'Cata de Vinos Tintos Premium', 'Cata de evaluación de vinos tintos de alta gama', CURRENT_DATE, 'planificada', ARRAY['Mesa 1', 'Mesa 2', 'Mesa 3'], 15)
ON CONFLICT (codigo) DO NOTHING;

-- Actualizar catadores existentes con datos de ejemplo
UPDATE catadores SET 
  password_hash = '$2b$10$examplehash', -- En producción usar hash real
  activo = true,
  logueado = false
WHERE password_hash IS NULL;

-- Comentarios
COMMENT ON TABLE tandas IS 'Tandas de cata - organización temporal de muestras y mesas';
COMMENT ON TABLE mesas IS 'Control de estado y ocupación de mesas de cata';
COMMENT ON TABLE tanda_muestras IS 'Relación entre tandas y muestras con orden y asignación de mesa';
COMMENT ON COLUMN catadores.logueado IS 'Indica si el catador está actualmente logueado';
COMMENT ON COLUMN catadores.mesa_actual IS 'Mesa donde está ubicado actualmente el catador';
COMMENT ON COLUMN catadores.session_id IS 'ID de sesión para control de login';