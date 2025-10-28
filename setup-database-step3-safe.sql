-- PASO 3 SIMPLE - ÍNDICES Y DATOS (SIN FOREIGN KEYS PROBLEMÁTICOS)
-- Ejecutar este archivo DESPUÉS del PASO 2 SIMPLE

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

-- 2. Insertar mesas de ejemplo (solo si no existen)
DO $$
BEGIN
    -- Insertar mesas solo si la tabla está vacía
    IF NOT EXISTS (SELECT 1 FROM mesas LIMIT 1) THEN
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
        ('Mesa 10', 'Mesa Principal 10', 4, 'Sala Oeste');
        
        RAISE NOTICE 'Mesas de ejemplo insertadas';
    ELSE
        RAISE NOTICE 'Mesas ya existen, omitiendo inserción';
    END IF;
END $$;

-- 3. Insertar catadores de ejemplo con passwords hasheados
DO $$
BEGIN
    -- Insertar catadores solo si no existen
    IF NOT EXISTS (SELECT 1 FROM catadores WHERE email = 'juan@catas.com') THEN
        INSERT INTO catadores (codigo, nombre, email, rol, mesa, password_hash, activo) VALUES
        ('CAT001', 'Juan Pérez', 'juan@catas.com', 'Catador Senior', 'Mesa 1', '$2b$10$rH1QqLxdHs7oPKYOzCRs/uAOQPOKWJKV5p0CZJ0W9YT7XJQP4JWJG', true),
        ('CAT002', 'María García', 'maria@catas.com', 'Catador Junior', 'Mesa 1', '$2b$10$rH1QqLxdHs7oPKYOzCRs/uAOQPOKWJKV5p0CZJ0W9YT7XJQP4JWJG', true),
        ('CAT003', 'Carlos López', 'carlos@catas.com', 'Catador Senior', 'Mesa 2', '$2b$10$rH1QqLxdHs7oPKYOzCRs/uAOQPOKWJKV5p0CZJ0W9YT7XJQP4JWJG', true),
        ('CAT004', 'Ana Martínez', 'ana@catas.com', 'Supervisor', 'Mesa 2', '$2b$10$rH1QqLxdHs7oPKYOzCRs/uAOQPOKWJKV5p0CZJ0W9YT7XJQP4JWJG', true),
        ('CAT005', 'Luis Rodríguez', 'luis@catas.com', 'Catador Junior', 'Mesa 3', '$2b$10$rH1QqLxdHs7oPKYOzCRs/uAOQPOKWJKV5p0CZJ0W9YT7XJQP4JWJG', true);
        
        RAISE NOTICE 'Catadores de ejemplo insertados';
    ELSE
        RAISE NOTICE 'Catadores ya existen, omitiendo inserción';
    END IF;
END $$;

-- 4. Insertar muestras de ejemplo
DO $$
BEGIN
    -- Insertar muestras solo si no existen
    IF NOT EXISTS (SELECT 1 FROM muestras WHERE codigo = 'MUE001') THEN
        INSERT INTO muestras (codigo, nombre, empresa, categoria, tanda, activo, existencias) VALUES
        ('MUE001', 'Cabernet Sauvignon Reserve', 'Bodega San Carlos', 'Tinto', '1', true, 24),
        ('MUE002', 'Malbec Premium', 'Viña Los Andes', 'Tinto', '1', true, 18),
        ('MUE003', 'Chardonnay Barrel', 'Bodega del Valle', 'Blanco', '1', true, 12),
        ('MUE004', 'Pinot Noir Gran Reserva', 'Bodega Montaña', 'Tinto', '2', true, 15),
        ('MUE005', 'Sauvignon Blanc', 'Viña del Mar', 'Blanco', '2', true, 20),
        ('MUE006', 'Syrah Roble', 'Bodega Colonial', 'Tinto', '2', true, 16);
        
        RAISE NOTICE 'Muestras de ejemplo insertadas';
    ELSE
        RAISE NOTICE 'Muestras ya existen, omitiendo inserción';
    END IF;
END $$;

-- 5. Insertar tandas de ejemplo
DO $$
BEGIN
    -- Insertar tandas solo si no existen
    IF NOT EXISTS (SELECT 1 FROM tandas WHERE codigo = 'TANDA001') THEN
        INSERT INTO tandas (codigo, nombre, descripcion, fecha_inicio, estado, mesas_asignadas, total_muestras) VALUES
        ('TANDA001', 'Cata de Vinos Tintos Premium', 'Evaluación de vinos tintos de alta gama para selección', CURRENT_DATE, 'planificada', ARRAY['Mesa 1', 'Mesa 2', 'Mesa 3'], 6),
        ('TANDA002', 'Cata de Blancos Varietales', 'Cata comparativa de vinos blancos varietales', CURRENT_DATE + 1, 'planificada', ARRAY['Mesa 4', 'Mesa 5'], 3);
        
        RAISE NOTICE 'Tandas de ejemplo insertadas';
    ELSE
        RAISE NOTICE 'Tandas ya existen, omitiendo inserción';
    END IF;
END $$;

-- 6. Insertar algunas relaciones tanda-muestra
DO $$
BEGIN
    -- Insertar relaciones solo si no existen
    IF NOT EXISTS (SELECT 1 FROM tanda_muestras LIMIT 1) THEN
        INSERT INTO tanda_muestras (tanda_id, muestra_id, orden_en_tanda, mesa_asignada) VALUES
        (1, 1, 1, 'Mesa 1'),
        (1, 2, 2, 'Mesa 1'),
        (1, 3, 3, 'Mesa 2'),
        (2, 4, 1, 'Mesa 4'),
        (2, 5, 2, 'Mesa 4'),
        (2, 6, 3, 'Mesa 5');
        
        RAISE NOTICE 'Relaciones tanda-muestra insertadas';
    ELSE
        RAISE NOTICE 'Relaciones tanda-muestra ya existen, omitiendo inserción';
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

-- 8. Verificar instalación
SELECT 'Base de datos configurada exitosamente' as resultado;
SELECT 'Credenciales de prueba: juan@catas.com / password123' as credenciales;

-- 9. Mostrar estadísticas
SELECT 
    (SELECT COUNT(*) FROM catadores) as total_catadores,
    (SELECT COUNT(*) FROM mesas) as total_mesas,
    (SELECT COUNT(*) FROM muestras) as total_muestras,
    (SELECT COUNT(*) FROM tandas) as total_tandas;