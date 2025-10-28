# 🍷 VIRTUS - Sistema de Gestión de Catas de Vino

Sistema completo para la gestión y control de catas de vino con funcionalidades avanzadas de organización de mesas, catadores y tandas.

![VIRTUS Preview](https://via.placeholder.com/800x400/333951/ffffff?text=VIRTUS+Wine+Management)

## 🎯 Características Principales

### � Sistema de Autenticación Avanzado
- **Login por Catadores**: Autenticación basada en tabla de catadores con email y clave
- **Control de Sesiones**: Gestión de sesiones con localStorage y tracking en tiempo real
- **Asignación de Mesas**: Control automático de ocupación y asignación de mesas
- **Estado de Conexión**: Monitoreo en tiempo real de catadores conectados

### 🪑 Control de Mesas Inteligente
- **Vista en Tiempo Real**: Monitoreo instantáneo del estado de todas las mesas
- **Ocupación Dinámica**: Control de capacidad y estado de cada mesa (vacía, parcial, completa)
- **Vista Dual**: Visualización en grid de mesas o tabla detallada
- **Estadísticas Live**: Métricas en tiempo real de ocupación y disponibilidad

### � Gestión de Tandas y Muestras
- **Organización Temporal**: Agrupación de muestras por tandas de cata
- **Asignación de Mesas**: Distribución automática de tandas a mesas específicas
- **Control de Progreso**: Seguimiento del estado de cada tanda y muestra
- **PWA Optimizada**: Interfaz optimizada para tablets en orientación horizontal

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: TanStack Query
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

### Pasos

1. **Clona el repositorio**
```bash
git clone https://github.com/jrsepul2020/catas2026.git
cd catas2026
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales de Supabase
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Ejecuta el proyecto**
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 🌐 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Conecta tu repositorio a Vercel**
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Haz clic en "New Project"
   - Selecciona este repositorio desde GitHub

2. **Configura las variables de entorno en Vercel**
   - En Project Settings → Environment Variables
   - Añade las siguientes variables:
     ```
     VITE_SUPABASE_URL=https://cfpawqoegitgtsjygbqp.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcGF3cW9lZ2l0Z3RzanlnYnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTkwNTEsImV4cCI6MjA3NTE3NTA1MX0.Ry3ufMVvFCaMafRrJpUkSafUuP-RnlSXAZ1z0wGdZNo
     ```

3. **Despliega**
   - Vercel detectará automáticamente que es un proyecto Vite
   - El despliegue se iniciará automáticamente
   - Tu app estará disponible en una URL personalizada

### Opción 2: Desde CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Despliega
vercel --prod
```

## 🗄️ Base de Datos (Supabase)

### Tablas Requeridas

El proyecto requiere las siguientes tablas en Supabase:

#### Tabla `catas`
```sql
CREATE TABLE catas (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  vino_nombre VARCHAR(255) NOT NULL,
  variedad VARCHAR(100),
  anada INTEGER,
  bodega VARCHAR(255),
  region VARCHAR(255),
  -- Evaluación visual
  color VARCHAR(100),
  intensidad_color INTEGER CHECK (intensidad_color >= 1 AND intensidad_color <= 10),
  limpidez VARCHAR(100),
  -- Evaluación olfativa  
  intensidad_aromatica INTEGER CHECK (intensidad_aromatica >= 1 AND intensidad_aromatica <= 10),
  aromas TEXT,
  -- Evaluación gustativa
  dulzor INTEGER CHECK (dulzor >= 1 AND dulzor <= 10),
  acidez INTEGER CHECK (acidez >= 1 AND acidez <= 10),
  taninos INTEGER CHECK (taninos >= 1 AND taninos <= 10),
  alcohol INTEGER CHECK (alcohol >= 1 AND alcohol <= 10),
  cuerpo INTEGER CHECK (cuerpo >= 1 AND cuerpo <= 10),
  sabores TEXT,
  -- Evaluación final
  persistencia INTEGER CHECK (persistencia >= 1 AND persistencia <= 10),
  calidad_general INTEGER CHECK (calidad_general >= 1 AND calidad_general <= 100),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `muestras`
```sql
CREATE TABLE muestras (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tanda VARCHAR(100),
  fecha_recepcion DATE,
  estado VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Personalización

El sistema incluye un panel de configuración completo donde puedes:
- Cambiar el esquema de colores
- Ajustar la tipografía
- Modificar el layout
- Configurar preferencias de usuario

## � PWA (Progressive Web App)

La aplicación está configurada como PWA, lo que significa:
- ✅ Instalable en dispositivos móviles
- ✅ Funciona offline (caché básico)
- ✅ Icono en pantalla de inicio
- ✅ Optimizada para móviles

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## � Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:
1. Revisa los [Issues existentes](https://github.com/jrsepul2020/catas2026/issues)
2. Crea un nuevo Issue si es necesario
3. Contacta al mantenedor: @jrsepul2020

---

**Desarrollado con ❤️ para amantes del vino**