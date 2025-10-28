-- Esquema de base de datos para Supabase
-- Ejecuta estos comandos en el SQL Editor de tu dashboard de Supabase

-- 1. Tabla de Vinos
CREATE TABLE IF NOT EXISTS public.vinos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 1,
    tanda INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Catas
CREATE TABLE IF NOT EXISTS public.catas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vino_id UUID REFERENCES public.vinos(id) ON DELETE CASCADE,
    codigo_vino VARCHAR(100) NOT NULL,
    catador_numero INTEGER NOT NULL,
    vista_limpidez INTEGER DEFAULT 0,
    vista_color INTEGER DEFAULT 0,
    olfato_limpidez INTEGER DEFAULT 0,
    olfato_intensidad INTEGER DEFAULT 0,
    olfato_calidad INTEGER DEFAULT 0,
    sabor_limpio INTEGER DEFAULT 0,
    sabor_intensidad INTEGER DEFAULT 0,
    sabor_persistencia INTEGER DEFAULT 0,
    sabor_calidad INTEGER DEFAULT 0,
    juicio_global INTEGER DEFAULT 0,
    puntos_totales INTEGER DEFAULT 0,
    descartado BOOLEAN DEFAULT false,
    tanda INTEGER DEFAULT 1,
    orden INTEGER DEFAULT 1,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.vinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catas ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de seguridad para vinos (todos pueden leer, solo autenticados pueden modificar)
CREATE POLICY "Todos pueden ver vinos" ON public.vinos
    FOR SELECT USING (true);

CREATE POLICY "Solo autenticados pueden insertar vinos" ON public.vinos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados pueden actualizar vinos" ON public.vinos
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados pueden eliminar vinos" ON public.vinos
    FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Políticas de seguridad para catas (usuarios solo pueden ver/modificar sus propias catas)
CREATE POLICY "Usuarios pueden ver sus propias catas" ON public.catas
    FOR SELECT USING (auth.uid()::text = created_by OR auth.role() = 'service_role');

CREATE POLICY "Usuarios pueden insertar sus propias catas" ON public.catas
    FOR INSERT WITH CHECK (auth.uid()::text = created_by OR auth.role() = 'service_role');

CREATE POLICY "Usuarios pueden actualizar sus propias catas" ON public.catas
    FOR UPDATE USING (auth.uid()::text = created_by OR auth.role() = 'service_role');

CREATE POLICY "Usuarios pueden eliminar sus propias catas" ON public.catas
    FOR DELETE USING (auth.uid()::text = created_by OR auth.role() = 'service_role');

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Triggers para actualizar updated_at
CREATE TRIGGER update_vinos_updated_at BEFORE UPDATE ON public.vinos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catas_updated_at BEFORE UPDATE ON public.catas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_vinos_activo ON public.vinos(activo);
CREATE INDEX IF NOT EXISTS idx_vinos_orden ON public.vinos(orden);
CREATE INDEX IF NOT EXISTS idx_catas_vino_id ON public.catas(vino_id);
CREATE INDEX IF NOT EXISTS idx_catas_created_by ON public.catas(created_by);
CREATE INDEX IF NOT EXISTS idx_catas_created_at ON public.catas(created_at);

-- 9. Datos de ejemplo para vinos (opcional)
INSERT INTO public.vinos (nombre, codigo, activo, orden, tanda) VALUES
    ('Vino Tinto Reserva', 'VT001', true, 1, 1),
    ('Vino Blanco Joven', 'VB002', true, 2, 1),
    ('Vino Rosado Premium', 'VR003', true, 3, 1),
    ('Vino Espumoso Brut', 'VE004', true, 4, 2),
    ('Vino Dulce Natural', 'VD005', true, 5, 2)
ON CONFLICT (codigo) DO NOTHING;

-- Verificar que las tablas se crearon correctamente
SELECT 'Tabla vinos creada' as status, count(*) as registros FROM public.vinos
UNION ALL
SELECT 'Tabla catas creada' as status, count(*) as registros FROM public.catas;