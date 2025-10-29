# 🔍 Pasos para Diagnosticar el Problema

## 1️⃣ Verificar en tu navegador (Producción - Vercel):

1. Abre la aplicación en Vercel
2. Presiona **F12** para abrir las DevTools
3. Ve a la pestaña **Console**
4. Navega a la página **Muestras**
5. **Copia y pega aquí TODO lo que aparece en la consola** (especialmente los mensajes con 🔍 ✅ ❌)

## 2️⃣ Verificar estructura de datos en Supabase:

Ejecuta este SQL en Supabase SQL Editor:

```sql
-- Verificar estructura de tabla muestras
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'muestras'
ORDER BY 
    ordinal_position;

-- Ver datos de ejemplo con empresa
SELECT 
    m.id,
    m.nombre,
    m.codigo,
    m.empresa_id,
    e.nombre as empresa_nombre
FROM 
    muestras m
LEFT JOIN 
    empresas e ON m.empresa_id = e.id
LIMIT 5;
```

**Copia y pega los resultados aquí**

## 3️⃣ Verificar políticas RLS:

```sql
-- Ver políticas de muestras
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM 
    pg_policies
WHERE 
    tablename = 'muestras';
```

**Copia y pega los resultados aquí**

## 4️⃣ Información que necesito:

- [ ] ¿La página Muestras aparece en blanco o muestra algún mensaje de error?
- [ ] ¿Ves algún spinner de carga (loading)?
- [ ] ¿La página Empresas funciona correctamente?
- [ ] ¿Puedes ver las empresas en la tabla de Empresas?
- [ ] ¿En qué navegador estás probando?
- [ ] ¿Es en producción (Vercel) o en desarrollo local?

---

**Por favor proporciona toda esta información para poder ayudarte mejor** 🙏
