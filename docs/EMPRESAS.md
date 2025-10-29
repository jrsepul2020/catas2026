# Gestión de Empresas - Instrucciones

## 🏢 Página de Empresas

La nueva página de **Empresas** permite gestionar las empresas productoras de vino y asignarles muestras.

### ✨ Características

#### 📋 Visualización
- **Vista de tarjetas**: Muestra todas las empresas en un diseño de tarjetas responsive
- **Información completa**: Nombre, CIF, email, teléfono, dirección y persona de contacto
- **Muestras asignadas**: Badge con contador y lista de muestras
- **Estado vacío**: Mensaje motivador cuando no hay empresas

#### ➕ Crear Empresa
1. Click en el botón **"Nueva Empresa"**
2. Completa el formulario:
   - **Nombre** (obligatorio)
   - Email
   - Teléfono
   - Dirección
   - CIF/NIF
   - Persona de contacto
3. Selecciona las **muestras** a asignar (checkbox múltiple)
4. Click en **"Crear Empresa"**

#### ✏️ Editar Empresa
1. Click en el botón **"Editar"** de la empresa
2. Modifica los datos necesarios
3. Añade o quita muestras asignadas
4. Click en **"Actualizar Empresa"**

#### 🗑️ Eliminar Empresa
1. Click en el botón de **papelera** (rojo)
2. Confirma la eliminación
3. Se eliminan también las asignaciones de muestras

### 🗄️ Base de Datos

#### Tabla empresa_muestras
Para que funcione la asignación de muestras, necesitas crear la tabla de relación:

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Ejecuta el script `database/empresa_muestras.sql`
3. Esto creará:
   - Tabla `empresa_muestras`
   - Índices para rendimiento
   - Políticas de seguridad (RLS)
   - Restricción de unicidad

#### Estructura de la tabla

```sql
CREATE TABLE empresa_muestras (
  id UUID PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id),
  muestra_id UUID REFERENCES muestras(id),
  created_at TIMESTAMP,
  UNIQUE(empresa_id, muestra_id)
);
```

### 🎯 Funcionalidades Técnicas

#### Características Implementadas
- ✅ CRUD completo de empresas
- ✅ Asignación múltiple de muestras
- ✅ Validación de formularios
- ✅ React Query para caché y sincronización
- ✅ Toast notifications para feedback
- ✅ Loading states y spinners
- ✅ Error handling robusto
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Fallback si no existe tabla de relación

#### Navegación
Accede desde el menú lateral:
- 🏢 **Empresas** → Entre "Mesas" y "Configuración"

### 📱 Diseño Responsive

#### Desktop (≥1024px)
- 3 columnas de tarjetas
- Formulario modal amplio

#### Tablet (768px-1023px)
- 2 columnas de tarjetas
- Formulario modal adaptado

#### Mobile (<768px)
- 1 columna de tarjetas
- Formulario modal a pantalla completa

### 🔐 Seguridad

- **RLS habilitado**: Solo usuarios autenticados pueden acceder
- **Validación**: Nombre obligatorio
- **Confirmación**: Dialog antes de eliminar
- **Cascade delete**: Elimina relaciones automáticamente

### 💡 Casos de Uso

#### 1. Registrar nueva bodega
```
Empresa: "Bodegas La Rioja"
CIF: A12345678
Email: contacto@larioja.com
Muestras: Reserva 2019, Crianza 2020
```

#### 2. Asignar muestras a empresa existente
- Editar empresa
- Seleccionar muestras adicionales
- Guardar cambios

#### 3. Ver muestras de una empresa
- Las tarjetas muestran badges con las primeras 3 muestras
- Si hay más, muestra "+X más"

### 🐛 Solución de Problemas

#### No se pueden asignar muestras
- Verifica que existe la tabla `empresa_muestras`
- Ejecuta el script SQL proporcionado
- Revisa políticas RLS en Supabase

#### Error al crear empresa
- Verifica campos obligatorios (nombre)
- Revisa estructura de tabla `empresas`
- Consulta logs del navegador

#### No aparece en el menú
- Verifica que el build fue exitoso
- Limpia caché del navegador
- Recarga la aplicación

### 🚀 Próximas Mejoras Sugeridas

- [ ] Filtros y búsqueda de empresas
- [ ] Exportar listado a PDF/Excel
- [ ] Importación masiva de empresas
- [ ] Historial de cambios
- [ ] Notas y comentarios por empresa
- [ ] Logo de empresa
- [ ] Clasificación/categorización

### 📞 Soporte

Si encuentras algún problema, revisa:
1. Consola del navegador (F12)
2. Logs de Supabase
3. Estructura de tablas en base de datos
