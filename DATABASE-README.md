# 🗄️ Base de Datos - VIRTUS

Configuración de la base de datos PostgreSQL en Supabase para el sistema VIRTUS.

## 🚀 Instalación Rápida

```bash
# Ejecutar script de configuración interactivo
./setup-database.sh
```

## 📋 Instalación Manual

### 1. Scripts de Base de Datos (EN ORDEN)

#### Paso 1: `setup-database-step1.sql`
**Crear tablas básicas**
```sql
-- Ejecutar en Supabase SQL Editor
-- Crea: catadores, muestras, tandas, mesas, catas
```

#### Paso 2: `setup-database-step2.sql` 
**Agregar columnas y relaciones**
```sql
-- CORREGIDO para PostgreSQL
-- Usa DO blocks para verificar existencia
-- Agrega campos de autenticación
```

#### Paso 3: `setup-database-step3.sql`
**Índices y datos de ejemplo**
```sql
-- Optimización de consultas
-- Datos de prueba incluidos
```

### 2. Configurar Variables de Entorno

```bash
# .env.local
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

## 🔧 Solución de Problemas

### Error: `syntax error at or near "NOT"`
**Problema**: PostgreSQL no soporta `IF NOT EXISTS` en `ALTER TABLE ADD CONSTRAINT`
**Solución**: ✅ Corregido usando DO blocks en step2.sql

### Error: `column "numero" does not exist`
**Problema**: Orden incorrecto de creación de tablas
**Solución**: ✅ Scripts divididos en pasos secuenciales

### Error: `relation does not exist`
**Problema**: Foreign keys creadas antes que las tablas
**Solución**: ✅ Foreign keys se crean en step2 después de todas las tablas

## 🎯 Credenciales de Prueba

Después de ejecutar los scripts, usa:
```
Email: juan@catas.com
Clave: password123
```

## 📊 Estructura de Tablas

### Autenticación
- `catadores`: Usuarios con login/password
- Campos: `email`, `password_hash`, `session_id`, `logueado`

### Control de Mesas
- `mesas`: Estado de mesas físicas
- `catadores.mesa_actual`: Asignación actual

### Organización
- `tandas`: Sesiones de cata organizadas
- `tanda_muestras`: Relación tandas-muestras
- `muestras`: Catálogo de vinos

### Evaluaciones
- `catas`: Registros de evaluación de vinos

## ✅ Verificación

Después de ejecutar los 3 pasos:

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar datos de ejemplo
SELECT COUNT(*) as catadores FROM catadores;
SELECT COUNT(*) as mesas FROM mesas;
SELECT COUNT(*) as muestras FROM muestras;
```

## 🔄 Actualización

Si necesitas actualizar el schema:
1. Hacer backup de datos importantes
2. Ejecutar scripts actualizados
3. Verificar integridad de datos

---

**✅ Scripts corregidos y probados para PostgreSQL/Supabase**