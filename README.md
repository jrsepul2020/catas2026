# Aplicación de Catas de Vino

Esta aplicación fue migrada de Base44 a Supabase. Es una aplicación Vite+React para gestionar catas de vino profesionales.

## 🚀 Configuración inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia `.env.example` a `.env`
3. Completa las variables de entorno con tus datos de Supabase:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima
   ```

### 3. Crear las tablas en Supabase
Ejecuta en el SQL Editor de Supabase:
- Para desarrollo fácil: `supabase-simple-schema.sql` (sin autenticación)
- Para producción: `supabase-schema.sql` (con seguridad completa)

### 4. Ejecutar la aplicación
```bash
npm run dev
```

## 📊 Características

- **Catas de vino**: Sistema completo de evaluación sensorial
- **Gestión de vinos**: Catálogo con códigos y orden de cata
- **Puntuación**: Sistema de 100 puntos con categorías
- **Historial**: Registro completo de todas las catas
- **Responsivo**: Funciona en móviles, tablets y desktop

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **UI**: Tailwind CSS + Radix UI
- **Base de datos**: Supabase (PostgreSQL)
- **Estado**: TanStack Query (React Query)
- **Autenticación**: Supabase Auth (opcional)

## 📁 Estructura del proyecto

```
src/
├── api/                 # Clientes de API
│   ├── supabaseClient.js   # Cliente principal de Supabase
│   └── entities.js         # Exportaciones de entidades
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI base
│   └── cata/           # Componentes específicos de cata
├── pages/              # Páginas principales
│   ├── CatarVino.jsx   # Interfaz de cata
│   ├── MisCatas.jsx    # Historial de catas
│   └── Dashboard.jsx   # Panel principal
└── hooks/              # Custom hooks
```

## 🗄️ Esquema de base de datos

### Tabla `vinos`
- Información básica de vinos para catar
- Campos: nombre, código, activo, orden, tanda

### Tabla `catas`
- Registros de evaluaciones sensoriales
- Puntuaciones por categoría (vista, olfato, sabor, juicio global)
- Relación con vinos y usuario catador

## 🔧 Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Linter ESLint

## 📝 Migración desde Base44

Esta aplicación fue migrada desde Base44 manteniendo toda la funcionalidad:
- ✅ Interfaz de usuario idéntica
- ✅ Misma lógica de negocio
- ✅ Esquema de datos compatible
- ✅ Funcionalidades completas

Los archivos de configuración de Base44 se mantienen para referencia pero ya no se usan.

## 🚨 Notas importantes

1. **Variables de entorno**: No olvides configurar el archivo `.env`
2. **Datos de prueba**: El schema incluye vinos de ejemplo
3. **Seguridad**: Para producción, usar el schema con RLS habilitado
4. **Desarrollo**: Para facilitar desarrollo, usar el schema simple sin autenticación

## 📞 Soporte

Para preguntas sobre la migración o uso de la aplicación, revisa la documentación en `SUPABASE_SETUP.md`.