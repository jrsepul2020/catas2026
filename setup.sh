#!/bin/bash

# Script de configuración completa del sistema VIRTUS
echo "🍷 Configurando sistema VIRTUS para cata de vinos..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOL
# Configuración de Supabase
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Configuración de la aplicación
VITE_APP_NAME=VIRTUS
VITE_APP_VERSION=1.0.0

# Configuración PWA
VITE_PWA_NAME=VIRTUS
VITE_PWA_SHORT_NAME=VIRTUS
VITE_PWA_DESCRIPTION=Sistema de Gestión de Catas de Vino

# Configuración de desarrollo
VITE_DEV_MODE=true
EOL
    echo "✅ Archivo .env.local creado. IMPORTANTE: Configura tus credenciales de Supabase."
else
    echo "⚠️  El archivo .env.local ya existe."
fi

# 3. Crear directorio de logs si no existe
mkdir -p logs
echo "✅ Directorio de logs creado."

# 4. Verificar estructura de archivos críticos
echo "🔍 Verificando estructura de archivos..."

critical_files=(
    "src/api/supabaseClient.js"
    "src/components/AuthProvider.jsx"
    "src/pages/Mesas.jsx"
    "src/pages/Dashboard.jsx"
    "enhanced-schema.sql"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - OK"
    else
        echo "❌ $file - FALTA"
    fi
done

# 5. Instrucciones finales
echo ""
echo "🎯 CONFIGURACIÓN COMPLETADA"
echo "================================"
echo ""
echo "📋 PASOS SIGUIENTES:"
echo "1. Configura tus credenciales de Supabase en .env.local"
echo "2. Ejecuta el schema SQL en tu base de datos Supabase:"
echo "   cat enhanced-schema.sql | psql -d tu_database_url"
echo "3. Inicia el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "🌐 FUNCIONALIDADES DISPONIBLES:"
echo "✅ Sistema de autenticación con catadores"
echo "✅ Control de mesas en tiempo real"
echo "✅ Gestión de tandas y muestras"
echo "✅ Interfaz PWA optimizada para tablets"
echo "✅ Dashboard con estadísticas"
echo ""
echo "🔗 URLs importantes:"
echo "- Desarrollo: http://localhost:5173"
echo "- Mesas: http://localhost:5173/Mesas"
echo "- Catadores: http://localhost:5173/Catadores"
echo "- Tandas: http://localhost:5173/Tandas"
echo ""
echo "🍷 ¡Listo para catar vinos!"