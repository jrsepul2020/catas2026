-- Script para verificar y ajustar las tablas existentes de Supabase
-- Ejecuta estas consultas una por una en tu SQL Editor

-- 1. VERIFICAR ESTRUCTURA DE LA TABLA MUESTRAS
-- =============================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'muestras' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. VERIFICAR ESTRUCTURA DE LA TABLA CATAS
-- ==========================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'catas' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. AÑADIR CAMPOS FALTANTES EN MUESTRAS (si no existen)
-- ======================================================
-- Solo ejecuta las líneas que correspondan a campos que NO tengas

-- Añadir campo nombre si no existe
ALTER TABLE public.muestras 
ADD COLUMN IF NOT EXISTS nombre VARCHAR(255);

-- Añadir campo codigo si no existe
ALTER TABLE public.muestras 
ADD COLUMN IF NOT EXISTS codigo VARCHAR(100);

-- Añadir campo activo si no existe
ALTER TABLE public.muestras 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Añadir campo orden si no existe
ALTER TABLE public.muestras 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 1;

-- Añadir campo tanda si no existe
ALTER TABLE public.muestras 
ADD COLUMN IF NOT EXISTS tanda INTEGER DEFAULT 1;

-- 4. AÑADIR CAMPOS FALTANTES EN CATAS (si no existen)
-- ===================================================
-- Solo ejecuta las líneas que correspondan a campos que NO tengas

-- Añadir relación con muestras si no existe
ALTER TABLE public.catas 
ADD COLUMN IF NOT EXISTS muestra_id UUID REFERENCES public.muestras(id);

-- Añadir campos de puntuación si no existen
ALTER TABLE public.catas 
ADD COLUMN IF NOT EXISTS vista_limpidez INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vista_color INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS olfato_limpidez INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS olfato_intensidad INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS olfato_calidad INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sabor_limpio INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sabor_intensidad INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sabor_persistencia INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sabor_calidad INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS juicio_global INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS puntos_totales INTEGER DEFAULT 0;

-- Añadir campos adicionales si no existen
ALTER TABLE public.catas 
ADD COLUMN IF NOT EXISTS codigo_vino VARCHAR(100),
ADD COLUMN IF NOT EXISTS catador_numero INTEGER,
ADD COLUMN IF NOT EXISTS descartado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tanda INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);

-- 5. CREAR ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_muestras_activo ON public.muestras(activo);
CREATE INDEX IF NOT EXISTS idx_muestras_orden ON public.muestras(orden);
CREATE INDEX IF NOT EXISTS idx_muestras_codigo ON public.muestras(codigo);

CREATE INDEX IF NOT EXISTS idx_catas_muestra_id ON public.catas(muestra_id);
CREATE INDEX IF NOT EXISTS idx_catas_created_by ON public.catas(created_by);
CREATE INDEX IF NOT EXISTS idx_catas_created_at ON public.catas(created_at);

-- 6. DESACTIVAR RLS PARA DESARROLLO FÁCIL (opcional)
-- ==================================================
ALTER TABLE public.muestras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.catas DISABLE ROW LEVEL SECURITY;

-- 7. VERIFICAR QUE TODO ESTÉ CORRECTO
-- ===================================
SELECT 'Muestras' as tabla, COUNT(*) as registros FROM public.muestras
UNION ALL
SELECT 'Catas' as tabla, COUNT(*) as registros FROM public.catas;