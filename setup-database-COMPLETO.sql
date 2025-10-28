-- SETUP COMPLETO EN UN SOLO ARCHIVO - SIN ERRORES
-- Ejecutar este archivo COMPLETO en Supabase SQL Editor

-- 1. CREAR TODAS LAS TABLAS
CREATE TABLE IF NOT EXISTS catadores (
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
  tanda_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS mesas (
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

CREATE TABLE IF NOT EXISTS catas (
  id SERIAL PRIMARY KEY,
  catador_id INTEGER,
  muestra_id INTEGER,
  tanda_id INTEGER,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  color VARCHAR(100),
  intensidad_color INTEGER CHECK (intensidad_color >= 1 AND intensidad_color <= 10),
  limpidez VARCHAR(100),
  intensidad_aromatica INTEGER CHECK (intensidad_aromatica >= 1 AND intensidad_aromatica <= 10),
  aromas TEXT,
  dulzor INTEGER CHECK (dulzor >= 1 AND dulzor <= 10),
  acidez INTEGER CHECK (acidez >= 1 AND acidez <= 10),
  taninos INTEGER CHECK (taninos >= 1 AND taninos <= 10),
  alcohol INTEGER CHECK (alcohol >= 1 AND alcohol <= 10),
  cuerpo INTEGER CHECK (cuerpo >= 1 AND cuerpo <= 10),
  sabores TEXT,
  persistencia INTEGER CHECK (persistencia >= 1 AND persistencia <= 10),
  calidad_general INTEGER CHECK (calidad_general >= 1 AND calidad_general <= 100),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tanda_muestras (
  id SERIAL PRIMARY KEY,
  tanda_id INTEGER,
  muestra_id INTEGER,
  orden_en_tanda INTEGER NOT NULL,
  mesa_asignada VARCHAR(50),
  completada BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR ÍNDICES BÁSICOS
CREATE INDEX IF NOT EXISTS idx_catadores_email ON catadores(email);
CREATE INDEX IF NOT EXISTS idx_catadores_logueado ON catadores(logueado);
CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);
CREATE INDEX IF NOT EXISTS idx_muestras_codigo ON muestras(codigo);
CREATE INDEX IF NOT EXISTS idx_tandas_codigo ON tandas(codigo);

-- 3. INSERTAR DATOS DE EJEMPLO (método seguro)

-- Mesas
INSERT INTO mesas (numero, nombre, capacidad, ubicacion) 
SELECT 'Mesa 1', 'Mesa Principal 1', 4, 'Sala Norte'
WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 'Mesa 1');

INSERT INTO mesas (numero, nombre, capacidad, ubicacion) 
SELECT 'Mesa 2', 'Mesa Principal 2', 4, 'Sala Norte'
WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 'Mesa 2');

INSERT INTO mesas (numero, nombre, capacidad, ubicacion) 
SELECT 'Mesa 3', 'Mesa Principal 3', 4, 'Sala Centro'
WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 'Mesa 3');

INSERT INTO mesas (numero, nombre, capacidad, ubicacion) 
SELECT 'Mesa 4', 'Mesa Principal 4', 4, 'Sala Centro'
WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 'Mesa 4');

INSERT INTO mesas (numero, nombre, capacidad, ubicacion) 
SELECT 'Mesa 5', 'Mesa Principal 5', 4, 'Sala Sur'
WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 'Mesa 5');

-- Catadores
INSERT INTO catadores (codigo, nombre, email, rol, mesa, password_hash, activo) 
SELECT 'CAT001', 'Juan Pérez', 'juan@catas.com', 'Catador Senior', 'Mesa 1', 'password123', true
WHERE NOT EXISTS (SELECT 1 FROM catadores WHERE email = 'juan@catas.com');

INSERT INTO catadores (codigo, nombre, email, rol, mesa, password_hash, activo) 
SELECT 'CAT002', 'María García', 'maria@catas.com', 'Catador Junior', 'Mesa 1', 'password123', true
WHERE NOT EXISTS (SELECT 1 FROM catadores WHERE email = 'maria@catas.com');

INSERT INTO catadores (codigo, nombre, email, rol, mesa, password_hash, activo) 
SELECT 'CAT003', 'Carlos López', 'carlos@catas.com', 'Catador Senior', 'Mesa 2', 'password123', true
WHERE NOT EXISTS (SELECT 1 FROM catadores WHERE email = 'carlos@catas.com');

-- Muestras
INSERT INTO muestras (codigo, nombre, empresa, categoria, tanda, activo, existencias) 
SELECT 'MUE001', 'Cabernet Sauvignon Reserve', 'Bodega San Carlos', 'Tinto', '1', true, 24
WHERE NOT EXISTS (SELECT 1 FROM muestras WHERE codigo = 'MUE001');

INSERT INTO muestras (codigo, nombre, empresa, categoria, tanda, activo, existencias) 
SELECT 'MUE002', 'Malbec Premium', 'Viña Los Andes', 'Tinto', '1', true, 18
WHERE NOT EXISTS (SELECT 1 FROM muestras WHERE codigo = 'MUE002');

INSERT INTO muestras (codigo, nombre, empresa, categoria, tanda, activo, existencias) 
SELECT 'MUE003', 'Chardonnay Barrel', 'Bodega del Valle', 'Blanco', '2', true, 12
WHERE NOT EXISTS (SELECT 1 FROM muestras WHERE codigo = 'MUE003');

-- Tandas
INSERT INTO tandas (codigo, nombre, descripcion, fecha_inicio, estado, total_muestras) 
SELECT 'TANDA001', 'Cata de Vinos Tintos Premium', 'Evaluación de vinos tintos de alta gama', CURRENT_DATE, 'planificada', 3
WHERE NOT EXISTS (SELECT 1 FROM tandas WHERE codigo = 'TANDA001');

-- 4. MOSTRAR RESULTADOS
SELECT 'SETUP COMPLETADO EXITOSAMENTE' as status;

SELECT 'TABLAS CREADAS:' as info;
SELECT table_name as tabla FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('catadores', 'mesas', 'muestras', 'tandas', 'catas', 'tanda_muestras')
ORDER BY table_name;

SELECT 'DATOS INSERTADOS:' as info;
SELECT 'Catadores' as tabla, COUNT(*) as total FROM catadores
UNION ALL
SELECT 'Mesas', COUNT(*) FROM mesas
UNION ALL
SELECT 'Muestras', COUNT(*) FROM muestras
UNION ALL
SELECT 'Tandas', COUNT(*) FROM tandas;

SELECT 'CREDENCIALES DE PRUEBA:' as info;
SELECT 'Email: juan@catas.com' as credencial
UNION ALL
SELECT 'Clave: password123';

SELECT 'BASE DE DATOS LISTA PARA USAR' as resultado;