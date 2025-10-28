-- SETUP MÍNIMO ABSOLUTO - SOLO LO ESENCIAL
-- Este script es 100% compatible con cualquier PostgreSQL

-- 1. CREAR TABLA CATADORES (mínima)
CREATE TABLE catadores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  logueado BOOLEAN DEFAULT false,
  mesa_actual VARCHAR(50),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. CREAR TABLA MESAS (mínima)
CREATE TABLE mesas (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(20) NOT NULL,
  nombre VARCHAR(255),
  capacidad INTEGER DEFAULT 4,
  activa BOOLEAN DEFAULT true,
  ocupada BOOLEAN DEFAULT false,
  catadores_actuales INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. CREAR TABLA MUESTRAS (mínima)
CREATE TABLE muestras (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50),
  nombre VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  categoria VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  existencias INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. CREAR TABLA TANDAS (mínima)
CREATE TABLE tandas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE,
  estado VARCHAR(50) DEFAULT 'planificada',
  total_muestras INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. INSERTAR DATOS ESENCIALES

-- Una mesa
INSERT INTO mesas (numero, nombre, capacidad) VALUES ('Mesa 1', 'Mesa Principal 1', 4);

-- Un catador
INSERT INTO catadores (nombre, email, password_hash, activo) VALUES ('Juan Pérez', 'juan@catas.com', 'password123', true);

-- Una muestra
INSERT INTO muestras (codigo, nombre, activo) VALUES ('MUE001', 'Vino de Prueba', true);

-- Una tanda
INSERT INTO tandas (codigo, nombre, estado) VALUES ('TANDA001', 'Cata de Prueba', 'planificada');

-- 6. VERIFICAR
SELECT 'BASE DE DATOS MÍNIMA CREADA' as resultado;
SELECT 'Login: juan@catas.com / password123' as credenciales;