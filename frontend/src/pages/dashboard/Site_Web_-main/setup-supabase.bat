@echo off
REM 🚀 Script de Configuración Rápida - Business Manager
REM ===================================================

echo.
echo 🎯 Business Manager - Configuración Rápida de Supabase
echo ======================================================
echo.

echo 📋 Por favor, proporciona tus credenciales de Supabase:
echo.

set /p SUPABASE_URL="🌐 Project URL (ej: https://abc123.supabase.co): "
set /p ANON_KEY="🔑 Anon Key: "
set /p SERVICE_KEY="🛡️ Service Role Key: "

echo.
echo 🔄 Configurando archivos...

REM Actualizar frontend/.env
echo 📝 Actualizando frontend/.env...
(
echo # 🔧 Configuración de Supabase - Business Manager
echo VITE_SUPABASE_URL=%SUPABASE_URL%
echo VITE_SUPABASE_ANON_KEY=%ANON_KEY%
) > frontend\.env
echo ✅ frontend/.env actualizado correctamente

REM Actualizar backend/.env
echo 📝 Actualizando backend/.env...
(
echo # 🎯 Configuración Backend - Business Manager
echo SUPABASE_URL=%SUPABASE_URL%
echo SUPABASE_ANON_KEY=%ANON_KEY%
echo SUPABASE_SERVICE_ROLE_KEY=%SERVICE_KEY%
echo PORT=3001
echo NODE_ENV=development
echo JWT_SECRET=tu-jwt-secret-super-seguro-cambiar-en-produccion
) > backend\.env
echo ✅ backend/.env actualizado correctamente

echo.
echo 🎉 ¡Configuración completada!
echo.
echo 📋 Próximos pasos:
echo 1. Reinicia los servidores (Ctrl+C y vuelve a ejecutar npm run dev)
echo 2. Ve a http://localhost:3002
echo 3. ¡Disfruta tu sistema completo!
echo.
echo 🔧 Si necesitas ayuda:
echo - Verifica que la URL y claves sean correctas
echo - Asegúrate de haber ejecutado los scripts SQL en Supabase
echo - Consulta la documentación en database/README.md
echo.
pause