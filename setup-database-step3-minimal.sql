-- PASO 3 ULTRA SIMPLE - SOLO ÍNDICES Y DATOS BÁSICOS
-- Ejecutar este archivo SI EL STEP3-SAFE DA PROBLEMAS

-- 1. Crear índices básicos (sin errores)
CREATE INDEX IF NOT EXISTS idx_catadores_email ON catadores(email);
CREATE INDEX IF NOT EXISTS idx_catadores_logueado ON catadores(logueado);
CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);
CREATE INDEX IF NOT EXISTS idx_muestras_codigo ON muestras(codigo);
CREATE INDEX IF NOT EXISTS idx_tandas_codigo ON tandas(codigo);

-- 2. Insertar una mesa de prueba (simple)
INSERT INTO mesas (numero, nombre, capacidad) 
SELECT 'Mesa 1', 'Mesa Principal 1', 4
WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 'Mesa 1');

INSERT INTO mesas (numero, nombre, capacidad) 
SELECT 'Mesa 2', 'Mesa Principal 2', 4
WHERE NOT EXISTS (SELECT 1 FROM mesas WHERE numero = 'Mesa 2');

-- 3. Insertar un catador de prueba (simple)
INSERT INTO catadores (codigo, nombre, email, password_hash, activo) 
SELECT 'CAT001', 'Juan Pérez', 'juan@catas.com', 'password123', true
WHERE NOT EXISTS (SELECT 1 FROM catadores WHERE email = 'juan@catas.com');

-- 4. Insertar una muestra de prueba (simple)
INSERT INTO muestras (codigo, nombre, activo) 
SELECT 'MUE001', 'Vino de Prueba', true
WHERE NOT EXISTS (SELECT 1 FROM muestras WHERE codigo = 'MUE001');

-- 5. Insertar una tanda de prueba (simple)
INSERT INTO tandas (codigo, nombre, estado) 
SELECT 'TANDA001', 'Cata de Prueba', 'planificada'
WHERE NOT EXISTS (SELECT 1 FROM tandas WHERE codigo = 'TANDA001');

-- 6. Verificación final
SELECT 'Setup completado exitosamente - Versión mínima' as resultado;

-- 7. Mostrar datos insertados
SELECT 'CATADORES:' as tabla, COUNT(*) as total FROM catadores
UNION ALL
SELECT 'MESAS:', COUNT(*) FROM mesas
UNION ALL
SELECT 'MUESTRAS:', COUNT(*) FROM muestras
UNION ALL
SELECT 'TANDAS:', COUNT(*) FROM tandas;

-- 8. Credenciales de prueba
SELECT 'Credenciales de prueba:' as info
UNION ALL
SELECT 'Email: juan@catas.com'
UNION ALL
SELECT 'Clave: password123';