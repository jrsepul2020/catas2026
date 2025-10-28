# 🚨 Solución de Error: "column tanda_actual_id does not exist"

## Problema
```
ERROR: 42703: column "tanda_actual_id" referenced in foreign key constraint does not exist
```

## ✅ Solución Rápida

**Si tienes error "column numero does not exist", usa la versión MINIMAL:**

### 1. Opción MINIMAL (MÁS SEGURA):
```sql
-- Ejecutar EN ORDEN en Supabase SQL Editor:
-- setup-database-step1.sql
-- setup-database-step2-safe.sql
-- setup-database-step3-minimal.sql  ← USAR ESTA
```

### 2. Opción SAFE (si no hay errores de columna):
```sql
-- Ejecutar EN ORDEN:
-- setup-database-step1.sql
-- setup-database-step2-safe.sql  
-- setup-database-step3-safe.sql
```

### 3. Opción ORIGINAL (puede dar errores):
```sql
-- Ejecutar EN ORDEN:
-- setup-database-step1.sql
-- setup-database-step2.sql
-- setup-database-step3.sql
```

## 🔧 Scripts Disponibles

| Script | Descripción | Errores | Recomendado |
|--------|-------------|---------|-------------|
| `step2.sql` | Con foreign keys | ❌ Puede dar errores | ❌ |
| `step2-safe.sql` | Solo columnas, sin foreign keys | ✅ Sin errores | ✅ |
| `step3.sql` | Con constraints y ON CONFLICT | ❌ Error de columnas | ❌ |  
| `step3-safe.sql` | Con DO blocks | ⚠️ Puede dar error numero | ⚠️ |
| `step3-minimal.sql` | Inserciones básicas con WHERE | ✅ Sin errores | ⭐ |

## 🎯 ¿Por qué ocurre este error?

1. **Orden de creación**: Las foreign keys se intentan crear antes que las columnas existan
2. **Dependencias circulares**: Tablas que se referencian mutuamente
3. **PostgreSQL estricto**: Supabase valida las foreign keys inmediatamente

## ✅ Los scripts SAFE solucionan esto:

- ✅ Crean todas las columnas primero
- ✅ Verifican existencia antes de crear
- ✅ No fallan por foreign keys
- ✅ Datos de ejemplo incluidos
- ✅ Sistema funcional inmediatamente

## 🚀 Después de usar scripts SAFE:

```bash
# Credenciales de prueba:
Email: juan@catas.com
Clave: password123

# El sistema funcionará correctamente sin foreign keys
# Las foreign keys son opcionales para el funcionamiento básico
```

## 📝 Verificación

Después de ejecutar los scripts SAFE:

```sql
-- Verificar que todo funciona:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar datos:
SELECT COUNT(*) FROM catadores;
SELECT COUNT(*) FROM mesas;
```

---

**💡 Recomendación: Usa siempre los scripts -safe.sql para evitar problemas**