#!/bin/bash

# 🍷 VIRTUS - Script de Configuración de Base de Datos
# Este script te guía para configurar la base de datos en Supabase

echo "🍷 VIRTUS - Configuración de Base de Datos"
echo "=========================================="
echo ""
echo "Para configurar la base de datos en Supabase, sigue estos pasos:"
echo ""
echo "1️⃣  Ve a tu proyecto de Supabase: https://supabase.com/dashboard"
echo "2️⃣  Haz clic en 'SQL Editor' en el menú lateral"
echo "3️⃣  OPCIONES DE CONFIGURACIÓN:"
echo ""
echo "   🏆 OPCIÓN DEFINITIVA - UN SOLO ARCHIVO (RECOMENDADO):"
echo "   📄 setup-database-COMPLETO.sql"
echo "      ✅ Sin errores garantizado"
echo "      ✅ Todo en un archivo"
echo "      ✅ Datos de ejemplo incluidos"
echo ""
echo "   📋 OPCIONES AVANZADAS (si prefieres pasos separados):"
echo ""
echo "   ⚡ OPCIÓN A - COMPLETA (puede dar errores):"
echo "   📄 PASO 1: setup-database-step1.sql"
echo "   📄 PASO 2: setup-database-step2.sql" 
echo "   📄 PASO 3: setup-database-step3.sql"
echo ""
echo "   ⚡ OPCIÓN B - SEGURA (sin foreign keys):"
echo "   📄 PASO 1: setup-database-step1.sql"
echo "   📄 PASO 2: setup-database-step2-safe.sql" 
echo "   📄 PASO 3: setup-database-step3-safe.sql"
echo ""
echo "   ⭐ OPCIÓN C - MINIMAL (más compatible):"
echo "   📄 PASO 1: setup-database-step1.sql"
echo "   📄 PASO 2: setup-database-step2-safe.sql" 
echo "   📄 PASO 3: setup-database-step3-minimal.sql"
echo ""
echo "   💡 Recomendado: Usar OPCIÓN DEFINITIVA para evitar errores"
echo ""
echo "4️⃣  Configura las variables de entorno:"
echo ""

# Verificar si existe .env.local
if [ -f ".env.local" ]; then
    echo "   ✅ Archivo .env.local encontrado"
else
    echo "   ⚠️  Creando archivo .env.local..."
    cat > .env.local << EOF
# Configuración de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# Configuración adicional
VITE_APP_TITLE=VIRTUS - Sistema de Catas
VITE_APP_VERSION=1.0.0
EOF
    echo "   📝 Archivo .env.local creado. ¡Edítalo con tus credenciales!"
fi

echo ""
echo "5️⃣  Después de configurar la base de datos, ejecuta:"
echo "      npm run dev"
echo ""
echo "🎯 CREDENCIALES DE PRUEBA:"
echo "   Email: juan@catas.com"
echo "   Clave: password123"
echo ""
echo "📚 Para más información, consulta el README.md"
echo ""
echo "¿Ya configuraste la base de datos? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 ¡Excelente! Iniciando servidor de desarrollo..."
    npm run dev
else
    echo ""
    echo "👍 Perfecto. Configura la base de datos primero y luego ejecuta:"
    echo "   npm run dev"
fi