#!/bin/bash
# 🚀 Script de Configuración Rápida - Business Manager
# ===================================================

echo "🎯 Business Manager - Configuración Rápida de Supabase"
echo "======================================================"
echo ""

# Función para actualizar archivo .env
update_env_file() {
    local file=$1
    local url=$2
    local anon_key=$3
    local service_key=$4

    echo "📝 Actualizando $file..."
    
    if [ "$file" == "frontend/.env" ]; then
        cat > "$file" << EOF
# 🔧 Configuración de Supabase - Business Manager
VITE_SUPABASE_URL=$url
VITE_SUPABASE_ANON_KEY=$anon_key
EOF
    else
        cat > "$file" << EOF
# 🎯 Configuración Backend - Business Manager
SUPABASE_URL=$url
SUPABASE_ANON_KEY=$anon_key
SUPABASE_SERVICE_ROLE_KEY=$service_key
PORT=3001
NODE_ENV=development
JWT_SECRET=tu-jwt-secret-super-seguro-cambiar-en-produccion
EOF
    fi
    
    echo "✅ $file actualizado correctamente"
}

# Recopilar información
echo "📋 Por favor, proporciona tus credenciales de Supabase:"
echo ""
read -p "🌐 Project URL (ej: https://abc123.supabase.co): " SUPABASE_URL
read -p "🔑 Anon Key: " ANON_KEY
read -p "🛡️ Service Role Key: " SERVICE_KEY

echo ""
echo "🔄 Configurando archivos..."

# Actualizar archivos .env
update_env_file "frontend/.env" "$SUPABASE_URL" "$ANON_KEY" ""
update_env_file "backend/.env" "$SUPABASE_URL" "$ANON_KEY" "$SERVICE_KEY"

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Reinicia los servidores (Ctrl+C y vuelve a ejecutar npm run dev)"
echo "2. Ve a http://localhost:3002"
echo "3. ¡Disfruta tu sistema completo!"
echo ""
echo "🔧 Si necesitas ayuda:"
echo "- Verifica que la URL y claves sean correctas"
echo "- Asegúrate de haber ejecutado los scripts SQL en Supabase"
echo "- Consulta la documentación en database/README.md"