-- Script para agregar la funcionalidad de presidente a las mesas
-- y configurar el sistema de mesas para catas

-- Agregar la columna presidente_id a la tabla mesas si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'mesas' AND column_name = 'presidente_id'
    ) THEN
        ALTER TABLE mesas ADD COLUMN presidente_id INTEGER REFERENCES catadores(id);
    END IF;
END $$;

-- Agregar índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_mesas_presidente_id ON mesas(presidente_id);

-- Crear tabla de configuración del sistema si no existe
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuraciones por defecto
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo) 
VALUES 
    ('mesas_default_capacidad', '5', 'Capacidad por defecto de las mesas (1 presidente + 4 catadores)', 'number'),
    ('max_mesas_permitidas', '10', 'Número máximo de mesas que se pueden crear', 'number'),
    ('require_presidente', 'false', 'Si es obligatorio asignar un presidente a cada mesa', 'boolean'),
    ('auto_assign_catadores', 'true', 'Asignar automáticamente catadores a mesas disponibles', 'boolean')
ON CONFLICT (clave) DO NOTHING;

-- Crear 5 mesas por defecto si la tabla está vacía
INSERT INTO mesas (numero, nombre, capacidad_total, activa) 
SELECT 
    serie.num,
    'Mesa ' || serie.num,
    5,
    true
FROM generate_series(1, 5) AS serie(num)
WHERE NOT EXISTS (SELECT 1 FROM mesas);

-- Función para obtener estadísticas de mesas
CREATE OR REPLACE FUNCTION get_mesas_estadisticas()
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'total_mesas', COUNT(*),
        'mesas_activas', COUNT(*) FILTER (WHERE activa = true),
        'mesas_con_presidente', COUNT(*) FILTER (WHERE presidente_id IS NOT NULL),
        'capacidad_total', COALESCE(SUM(capacidad_total), 0),
        'ocupacion_actual', (
            SELECT COUNT(*) FROM catadores WHERE mesa_id IS NOT NULL
        ),
        'mesas_completas', (
            SELECT COUNT(*) 
            FROM mesas m 
            WHERE (
                SELECT COUNT(*) FROM catadores c WHERE c.mesa_id = m.id
            ) >= m.capacidad_total
        )
    ) INTO resultado FROM mesas;
    
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Función para validar asignación de presidente
CREATE OR REPLACE FUNCTION validate_presidente_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se está asignando un presidente
    IF NEW.presidente_id IS NOT NULL THEN
        -- Verificar que el catador existe
        IF NOT EXISTS (SELECT 1 FROM catadores WHERE id = NEW.presidente_id) THEN
            RAISE EXCEPTION 'El catador especificado como presidente no existe';
        END IF;
        
        -- Verificar que el catador no sea presidente de otra mesa
        IF EXISTS (
            SELECT 1 FROM mesas 
            WHERE presidente_id = NEW.presidente_id 
            AND id != COALESCE(NEW.id, -1)
        ) THEN
            RAISE EXCEPTION 'El catador ya es presidente de otra mesa';
        END IF;
        
        -- Opcional: Asignar automáticamente el presidente a la mesa
        UPDATE catadores 
        SET mesa_id = NEW.id 
        WHERE id = NEW.presidente_id AND mesa_id IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para validación de presidente
DROP TRIGGER IF EXISTS trigger_validate_presidente ON mesas;
CREATE TRIGGER trigger_validate_presidente
    BEFORE INSERT OR UPDATE ON mesas
    FOR EACH ROW
    EXECUTE FUNCTION validate_presidente_assignment();

-- Trigger para actualizar timestamp de configuración
CREATE OR REPLACE FUNCTION update_configuracion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_configuracion_timestamp ON configuracion_sistema;
CREATE TRIGGER trigger_update_configuracion_timestamp
    BEFORE UPDATE ON configuracion_sistema
    FOR EACH ROW
    EXECUTE FUNCTION update_configuracion_timestamp();

-- Comentarios sobre las tablas
COMMENT ON TABLE mesas IS 'Mesas de cata con capacidad y presidente asignado';
COMMENT ON COLUMN mesas.presidente_id IS 'ID del catador que actúa como presidente de la mesa';
COMMENT ON TABLE configuracion_sistema IS 'Configuraciones globales del sistema de catas';

-- Mostrar estadísticas iniciales
SELECT 'Estadísticas iniciales de mesas:' as info;
SELECT get_mesas_estadisticas() as estadisticas;

COMMIT;