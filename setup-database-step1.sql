-- PASO 1: CREAR TABLAS BÁSICAS
-- Ejecutar este archivo PRIMERO en Supabase SQL Editor

-- 1. Crear tabla catadores
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

-- 2. Crear tabla muestras
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

-- 3. Crear tabla tandas
CREATE TABLE IF NOT EXISTS tandas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  hora_inicio TIME,
  hora_fin TIME,
  estado VARCHAR(50) DEFAULT 'planificada',
  
  -- Configuración de mesas
  mesas_asignadas TEXT[],
  max_mesas INTEGER DEFAULT 10,
  catadores_por_mesa INTEGER DEFAULT 4,
  
  -- Configuración de muestras
  total_muestras INTEGER DEFAULT 0,
  muestras_por_mesa INTEGER DEFAULT 10,
  
  -- Control de tiempo
  tiempo_por_muestra INTEGER DEFAULT 10,
  descanso_entre_muestras INTEGER DEFAULT 2,
  
  -- Metadatos
  creado_por VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla mesas
CREATE TABLE IF NOT EXISTS mesas (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255),
  capacidad INTEGER DEFAULT 4,
  activa BOOLEAN DEFAULT true,
  
  -- Estado actual
  ocupada BOOLEAN DEFAULT false,
  catadores_actuales INTEGER DEFAULT 0,
  tanda_actual_id INTEGER,
  
  -- Configuración física
  ubicacion VARCHAR(255),
  equipamiento TEXT,
  observaciones TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear tabla catas
CREATE TABLE IF NOT EXISTS catas (
  id SERIAL PRIMARY KEY,
  catador_id INTEGER,
  muestra_id INTEGER,
  tanda_id INTEGER,
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

-- Confirmar que las tablas se crearon
SELECT 'Tablas creadas correctamente' as mensaje;