-- SETUP ULTRA SIMPLE - SIN VERIFICACIONES COMPLEJAS
-- Ejecutar este archivo en Supabase SQL Editor

-- 1. ELIMINAR TABLAS EXISTENTES (si hay conflictos)
DROP TABLE IF EXISTS tanda_muestras CASCADE;
DROP TABLE IF EXISTS catas CASCADE;
DROP TABLE IF EXISTS mesas CASCADE;
DROP TABLE IF EXISTS tandas CASCADE;
DROP TABLE IF EXISTS muestras CASCADE;
DROP TABLE IF EXISTS catadores CASCADE;

-- 2. CREAR TABLA CATADORES
CREATE TABLE catadores (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  rol VARCHAR(100),
  mesa VARCHAR(50),
  tablet VARCHAR(100),
  password_hash VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  ultimo_login TIMESTAMP WITH TIME ZONE,
  session_id VARCHAR(255),
  mesa_actual VARCHAR(50),
  logueado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR TABLA MESAS
CREATE TABLE mesas (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255),
  capacidad INTEGER DEFAULT 4,
  activa BOOLEAN DEFAULT true,
  ocupada BOOLEAN DEFAULT false,
  catadores_actuales INTEGER DEFAULT 0,
  tanda_actual_id INTEGER,
  ubicacion VARCHAR(255),
  equipamiento TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREAR TABLA MUESTRAS
CREATE TABLE muestras (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  categoria VARCHAR(100),
  descripcion TEXT,
  tanda VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  existencias INTEGER DEFAULT 0,
  tanda_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CREAR TABLA TANDAS
CREATE TABLE tandas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  hora_inicio TIME,
  hora_fin TIME,
  estado VARCHAR(50) DEFAULT 'planificada',
  mesas_asignadas TEXT[],
  max_mesas INTEGER DEFAULT 10,
  catadores_por_mesa INTEGER DEFAULT 4,
  total_muestras INTEGER DEFAULT 0,
  muestras_por_mesa INTEGER DEFAULT 10,
  tiempo_por_muestra INTEGER DEFAULT 10,
  descanso_entre_muestras INTEGER DEFAULT 2,
  creado_por VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CREAR TABLA CATAS
CREATE TABLE catas (
  id SERIAL PRIMARY KEY,
  catador_id INTEGER,
  muestra_id INTEGER,
  tanda_id INTEGER,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  color VARCHAR(100),
  intensidad_color INTEGER,
  limpidez VARCHAR(100),
  intensidad_aromatica INTEGER,
  aromas TEXT,
  dulzor INTEGER,
  acidez INTEGER,
  taninos INTEGER,
  alcohol INTEGER,
  cuerpo INTEGER,
  sabores TEXT,
  persistencia INTEGER,
  calidad_general INTEGER,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CREAR TABLA TANDA_MUESTRAS
CREATE TABLE tanda_muestras (
  id SERIAL PRIMARY KEY,
  tanda_id INTEGER,
  muestra_id INTEGER,
  orden_en_tanda INTEGER NOT NULL,
  mesa_asignada VARCHAR(50),
  completada BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. INSERTAR DATOS BÁSICOS (sin verificaciones complejas)

-- Insertar mesas
INSERT INTO mesas (numero, nombre, capacidad, ubicacion) VALUES
('Mesa 1', 'Mesa Principal 1', 4, 'Sala Norte');

INSERT INTO mesas (numero, nombre, capacidad, ubicacion) VALUES
('Mesa 2', 'Mesa Principal 2', 4, 'Sala Norte');

INSERT INTO mesas (numero, nombre, capacidad, ubicacion) VALUES
('Mesa 3', 'Mesa Principal 3', 4, 'Sala Centro');

-- Insertar catadores
INSERT INTO catadores (codigo, nombre, email, rol, mesa, password_hash, activo) VALUES
('CAT001', 'Juan Pérez', 'juan@catas.com', 'Catador Senior', 'Mesa 1', 'password123', true);

INSERT INTO catadores (codigo, nombre, email, rol, mesa, password_hash, activo) VALUES
('CAT002', 'María García', 'maria@catas.com', 'Catador Junior', 'Mesa 1', 'password123', true);

-- Insertar muestras
INSERT INTO muestras (codigo, nombre, empresa, categoria, tanda, activo, existencias) VALUES
('MUE001', 'Cabernet Sauvignon Reserve', 'Bodega San Carlos', 'Tinto', '1', true, 24);

INSERT INTO muestras (codigo, nombre, empresa, categoria, tanda, activo, existencias) VALUES
('MUE002', 'Malbec Premium', 'Viña Los Andes', 'Tinto', '1', true, 18);

-- Insertar tanda
INSERT INTO tandas (codigo, nombre, descripcion, fecha_inicio, estado, total_muestras) VALUES
('TANDA001', 'Cata de Vinos Tintos Premium', 'Evaluación de vinos tintos de alta gama', CURRENT_DATE, 'planificada', 2);

-- 9. CREAR ÍNDICES BÁSICOS
CREATE INDEX idx_catadores_email ON catadores(email);
CREATE INDEX idx_catadores_logueado ON catadores(logueado);
CREATE INDEX idx_mesas_numero ON mesas(numero);
CREATE INDEX idx_muestras_codigo ON muestras(codigo);
CREATE INDEX idx_tandas_codigo ON tandas(codigo);

-- 10. VERIFICAR RESULTADOS
SELECT 'SETUP COMPLETADO - VERSION ULTRA SIMPLE' as status;

SELECT COUNT(*) as total_catadores FROM catadores;
SELECT COUNT(*) as total_mesas FROM mesas;
SELECT COUNT(*) as total_muestras FROM muestras;
SELECT COUNT(*) as total_tandas FROM tandas;

SELECT 'Credenciales: juan@catas.com / password123' as login;