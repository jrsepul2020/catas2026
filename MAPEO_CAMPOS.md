-- Mapeo REAL basado en la estructura de tu tabla MUESTRAS

-- TABLA MUESTRAS (estructura real)
-- ================================
-- id              -> uuid (PRIMARY KEY)
-- codigo          -> integer (auto-generado 1000-9999)
-- nombre          -> text (NOT NULL)
-- categoria       -> text
-- empresa         -> text
-- origen          -> text
-- igp             -> text
-- pais            -> text
-- azucar          -> numeric
-- grado           -> numeric
-- existencias     -> integer (default 0)
-- año             -> integer
-- tipouva         -> text
-- tipoaceituna    -> text
-- destilado       -> text
-- fecha           -> date (default CURRENT_DATE)
-- manual          -> boolean (default false)
-- creada          -> timestamp with time zone (default now())
-- ididempresa     -> uuid
-- categoriaoiv    -> text
-- categoriadecata -> text
-- created_at      -> timestamp with time zone (default now())
-- pagada          -> boolean (default false)
-- modificada_en   -> timestamp with time zone (default now())
-- tanda           -> bigint
-- codigotexto     -> text

-- MAPEO APLICACIÓN -> MUESTRAS
-- ============================
-- Aplicación      -> Campo Real en Muestras
-- nombre          -> nombre ✓
-- codigo          -> codigotexto (o codigo convertido a string) ✓
-- activo          -> existencias > 0 (calculado) ✓
-- orden           -> codigo (usado como orden) ✓
-- tanda           -> tanda ✓

-- TABLA CATAS (pendiente de verificar estructura)
-- ===============================================
-- Necesitamos ver la estructura real de tu tabla catas
-- Probables mapeos:
-- vino_id         -> idmuestra (relación con muestras)
-- codigo_vino     -> codigo
-- catador_numero  -> catador

-- QUERIES PARA REVISAR TUS TABLAS:
-- Ejecuta estos comandos para ver la estructura exacta de tus tablas

-- 1. Estructura de muestras:
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'muestras' AND table_schema = 'public';

-- 2. Estructura de catas:
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'catas' AND table_schema = 'public';

-- 3. Algunos registros de muestras:
SELECT * FROM muestras LIMIT 3;

-- 4. Algunos registros de catas:
SELECT * FROM catas LIMIT 3;