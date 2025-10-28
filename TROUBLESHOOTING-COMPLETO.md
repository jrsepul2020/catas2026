# 🚨 DIAGNÓSTICO: Error "column numero does not exist"

## 🔍 Paso 1: Diagnosticar el Problema

**Ejecuta primero:** `diagnostico-database.sql`

Este script te dirá:
- ✅ Qué tablas existen
- ✅ Qué columnas tiene cada tabla
- ✅ Si hay datos ya insertados
- ✅ Qué constraints/índices existen

## 🛠️ Paso 2: Soluciones por Orden de Simplicidad

### Opción 1: MÍNIMO ABSOLUTO ⭐
```sql
-- Ejecutar: setup-database-MINIMO.sql
-- Solo tablas básicas, sin constraints complicados
-- Garantizado que funciona
```

### Opción 2: ULTRA SIMPLE
```sql
-- Ejecutar: setup-database-ULTRA-SIMPLE.sql
-- Incluye DROP TABLE para limpiar conflictos
-- Más completo que MÍNIMO
```

### Opción 3: COMPLETO (si los anteriores fallan)
```sql
-- Ejecutar: setup-database-COMPLETO.sql
-- Version completa con todas las features
```

## 🔧 Paso 3: Si NADA Funciona

### Limpiar Todo y Empezar Desde Cero:

```sql
-- 1. BORRAR TODO (CUIDADO - ESTO BORRA DATOS)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 2. Ejecutar setup-database-MINIMO.sql
```

## 🤔 Posibles Causas del Error

| Causa | Descripción | Solución |
|-------|-------------|----------|
| **Tabla ya existe** | Mesas creada sin columna "numero" | DROP y recrear |
| **Script ejecutado parcialmente** | Solo algunas tablas se crearon | Usar ULTRA-SIMPLE con DROP |
| **Conflicto de nombres** | Otra tabla con mismo nombre | Ver diagnóstico |
| **Permisos insuficientes** | No puede crear/modificar tablas | Verificar permisos Supabase |
| **Cache de Supabase** | Editor no ve cambios recientes | Refrescar página |

## 📋 Orden de Ejecución Recomendado

```bash
# 1. DIAGNÓSTICO
diagnostico-database.sql

# 2. SOLUCIÓN MÍNIMA
setup-database-MINIMO.sql

# 3. VERIFICAR QUE FUNCIONA
SELECT * FROM catadores;
SELECT * FROM mesas;

# 4. SI FUNCIONA, puedes agregar más datos manualmente
```

## ✅ Después de Solucionar

### Credenciales de Prueba:
```
Email: juan@catas.com
Clave: password123
```

### Verificar Funcionalidad:
```sql
-- Ver que todo existe
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Ver datos
SELECT COUNT(*) FROM catadores;
SELECT COUNT(*) FROM mesas;
```

---

## 🆘 Último Recurso

Si **NADA** funciona, el problema puede ser:

1. **Permisos de Supabase**: Tu usuario no puede crear tablas
2. **Proyecto corrupto**: Crear nuevo proyecto Supabase
3. **Cache del navegador**: Usar ventana incógnito
4. **Version de PostgreSQL**: Supabase usa sintaxis específica

### Contactar Soporte:
- Copiar el mensaje de error COMPLETO
- Especificar qué script estabas ejecutando
- Mencionar si es proyecto nuevo o existente