-- Tabla catadores para el sistema VIRTUS
-- Esta tabla almacena la información de los catadores y sus asignaciones

CREATE TABLE catadores (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefono VARCHAR(50),
  
  -- Asignaciones editables
  rol VARCHAR(50) DEFAULT 'Catador',
  mesa VARCHAR(50),
  puesto VARCHAR(50), 
  tablet VARCHAR(50),
  
  -- Información adicional
  empresa VARCHAR(255),
  observaciones TEXT,
  activo BOOLEAN DEFAULT true,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_catadores_codigo ON catadores(codigo);
CREATE INDEX idx_catadores_email ON catadores(email);
CREATE INDEX idx_catadores_activo ON catadores(activo);
CREATE INDEX idx_catadores_rol ON catadores(rol);
CREATE INDEX idx_catadores_mesa ON catadores(mesa);

-- Datos de ejemplo para testing
INSERT INTO catadores (codigo, nombre, email, rol, mesa, puesto, tablet) VALUES
('CAT001', 'Juan Pérez García', 'juan.perez@email.com', 'Experto', 'Mesa 1', 'Puesto 1', 'Tablet 01'),
('CAT002', 'María García López', 'maria.garcia@email.com', 'Catador', 'Mesa 2', 'Puesto 3', 'Tablet 05'),
('CAT003', 'Carlos López Ruiz', 'carlos.lopez@email.com', 'Presidente', 'Mesa 1', 'Puesto 2', 'Tablet 02'),
('CAT004', 'Ana Martínez Silva', 'ana.martinez@email.com', 'Supervisor', 'Mesa 3', 'Puesto 1', 'Tablet 08'),
('CAT005', 'Pedro Rodríguez Vega', 'pedro.rodriguez@email.com', 'Catador', 'Mesa 2', 'Puesto 4', 'Tablet 06');

-- Comentarios en las columnas
COMMENT ON TABLE catadores IS 'Tabla de catadores del sistema VIRTUS';
COMMENT ON COLUMN catadores.codigo IS 'Código único del catador (ej: CAT001)';
COMMENT ON COLUMN catadores.rol IS 'Rol del catador: Catador, Experto, Presidente, Supervisor, Invitado';
COMMENT ON COLUMN catadores.mesa IS 'Mesa asignada para la cata (ej: Mesa 1)';
COMMENT ON COLUMN catadores.puesto IS 'Puesto específico en la mesa (ej: Puesto 1)';
COMMENT ON COLUMN catadores.tablet IS 'Tablet asignada para el registro digital (ej: Tablet 01)';