-- PASO 3: CREAR ÍNDICES Y DATOS DE EJEMPLO
-- Ejecutar este archivo DESPUÉS del PASO 2

-- 1. Crear índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_catadores_email ON catadores(email);
CREATE INDEX IF NOT EXISTS idx_catadores_session_id ON catadores(session_id);
CREATE INDEX IF NOT EXISTS idx_catadores_logueado ON catadores(logueado);
CREATE INDEX IF NOT EXISTS idx_catadores_mesa_actual ON catadores(mesa_actual);

CREATE INDEX IF NOT EXISTS idx_tandas_codigo ON tandas(codigo);
CREATE INDEX IF NOT EXISTS idx_tandas_fecha_inicio ON tandas(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_tandas_estado ON tandas(estado);

CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);
CREATE INDEX IF NOT EXISTS idx_mesas_activa ON mesas(activa);
CREATE INDEX IF NOT EXISTS idx_mesas_tanda_actual ON mesas(tanda_actual_id);

CREATE INDEX IF NOT EXISTS idx_muestras_codigo ON muestras(codigo);
CREATE INDEX IF NOT EXISTS idx_muestras_tanda_id ON muestras(tanda_id);
CREATE INDEX IF NOT EXISTS idx_muestras_activo ON muestras(activo);

CREATE INDEX IF NOT EXISTS idx_tanda_muestras_tanda ON tanda_muestras(tanda_id);
CREATE INDEX IF NOT EXISTS idx_tanda_muestras_muestra ON tanda_muestras(muestra_id);
CREATE INDEX IF NOT EXISTS idx_tanda_muestras_mesa ON tanda_muestras(mesa_asignada);

CREATE INDEX IF NOT EXISTS idx_catas_catador ON catas(catador_id);
CREATE INDEX IF NOT EXISTS idx_catas_muestra ON catas(muestra_id);
CREATE INDEX IF NOT EXISTS idx_catas_tanda ON catas(tanda_id);
CREATE INDEX IF NOT EXISTS idx_catas_fecha ON catas(fecha);

-- 2. Insertar mesas de ejemplo
INSERT INTO mesas (numero, nombre, capacidad, ubicacion) VALUES
('Mesa 1', 'Mesa Principal 1', 4, 'Sala Norte'),
('Mesa 2', 'Mesa Principal 2', 4, 'Sala Norte'),
('Mesa 3', 'Mesa Principal 3', 4, 'Sala Centro'),
('Mesa 4', 'Mesa Principal 4', 4, 'Sala Centro'),
('Mesa 5', 'Mesa Principal 5', 4, 'Sala Sur'),
('Mesa 6', 'Mesa Principal 6', 4, 'Sala Sur'),
('Mesa 7', 'Mesa Principal 7', 4, 'Sala Este'),
('Mesa 8', 'Mesa Principal 8', 4, 'Sala Este'),
('Mesa 9', 'Mesa Principal 9', 4, 'Sala Oeste'),
('Mesa 10', 'Mesa Principal 10', 4, 'Sala Oeste')
ON CONFLICT (numero) DO NOTHING;

-- 3. Insertar catadores de ejemplo
INSERT INTO catadores (codigo, nombre, email, rol, mesa, password_hash, activo) VALUES
('CAT001', 'Juan Pérez', 'juan@catas.com', 'Catador Senior', 'Mesa 1', '$2b$10$example.hash.for.password123', true),
('CAT002', 'María García', 'maria@catas.com', 'Catador Junior', 'Mesa 1', '$2b$10$example.hash.for.password456', true),
('CAT003', 'Carlos López', 'carlos@catas.com', 'Catador Senior', 'Mesa 2', '$2b$10$example.hash.for.password789', true),
('CAT004', 'Ana Martínez', 'ana@catas.com', 'Supervisor', 'Mesa 2', '$2b$10$example.hash.for.supervisor', true),
('CAT005', 'Luis Rodríguez', 'luis@catas.com', 'Catador Junior', 'Mesa 3', '$2b$10$example.hash.for.junior', true)
ON CONFLICT (email) DO NOTHING;

-- 4. Insertar muestras de ejemplo
INSERT INTO muestras (codigo, nombre, empresa, categoria, tanda, activo, existencias) VALUES
('MUE001', 'Cabernet Sauvignon Reserve', 'Bodega San Carlos', 'Tinto', '1', true, 24),
('MUE002', 'Malbec Premium', 'Viña Los Andes', 'Tinto', '1', true, 18),
('MUE003', 'Chardonnay Barrel', 'Bodega del Valle', 'Blanco', '1', true, 12),
('MUE004', 'Pinot Noir Gran Reserva', 'Bodega Montaña', 'Tinto', '2', true, 15),
('MUE005', 'Sauvignon Blanc', 'Viña del Mar', 'Blanco', '2', true, 20),
('MUE006', 'Syrah Roble', 'Bodega Colonial', 'Tinto', '2', true, 16)
ON CONFLICT (codigo) DO NOTHING;

-- 5. Insertar tanda de ejemplo
INSERT INTO tandas (codigo, nombre, descripcion, fecha_inicio, estado, mesas_asignadas, total_muestras) VALUES
('TANDA001', 'Cata de Vinos Tintos Premium', 'Evaluación de vinos tintos de alta gama para selección', CURRENT_DATE, 'planificada', ARRAY['Mesa 1', 'Mesa 2', 'Mesa 3'], 6),
('TANDA002', 'Cata de Blancos Varietales', 'Cata comparativa de vinos blancos varietales', CURRENT_DATE + 1, 'planificada', ARRAY['Mesa 4', 'Mesa 5'], 3)
ON CONFLICT (codigo) DO NOTHING;

-- 6. Crear constraints únicos adicionales
DO $$ 
BEGIN 
    -- Constraint único para tanda-muestra
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'unique_tanda_muestra' AND table_name = 'tanda_muestras') THEN
        ALTER TABLE tanda_muestras ADD CONSTRAINT unique_tanda_muestra 
          UNIQUE(tanda_id, muestra_id);
    END IF;

    -- Constraint único para tanda-orden
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'unique_tanda_orden' AND table_name = 'tanda_muestras') THEN
        ALTER TABLE tanda_muestras ADD CONSTRAINT unique_tanda_orden 
          UNIQUE(tanda_id, orden_en_tanda);
    END IF;
END $$;

-- 7. Comentarios para documentación
COMMENT ON TABLE catadores IS 'Usuarios del sistema con capacidad de autenticación y asignación de mesas';
COMMENT ON TABLE tandas IS 'Tandas de cata - organización temporal de muestras y mesas';
COMMENT ON TABLE mesas IS 'Control de estado y ocupación de mesas de cata';
COMMENT ON TABLE tanda_muestras IS 'Relación entre tandas y muestras con orden y asignación de mesa';
COMMENT ON TABLE catas IS 'Registros de evaluaciones de vino realizadas por catadores';
COMMENT ON TABLE muestras IS 'Catálogo de vinos disponibles para cata';

COMMENT ON COLUMN catadores.logueado IS 'Indica si el catador está actualmente logueado en el sistema';
COMMENT ON COLUMN catadores.mesa_actual IS 'Mesa donde está ubicado actualmente el catador';
COMMENT ON COLUMN catadores.session_id IS 'ID de sesión único para control de login';
COMMENT ON COLUMN catadores.password_hash IS 'Hash de la contraseña del catador para autenticación';

-- Confirmar que todo se completó
SELECT 'Base de datos configurada completamente' as mensaje;