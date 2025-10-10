@echo off
echo ========================================
echo    VERIFICANDO ESTADO DE LOS SERVIDORES
echo ========================================
echo.

echo [1] Verificando Frontend (puerto 3000)...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ Frontend: FUNCIONANDO' -ForegroundColor Green } catch { Write-Host '❌ Frontend: NO responde' -ForegroundColor Red }"

echo.
echo [2] Verificando Backend (puerto 3004)...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3004/health' -TimeoutSec 5; Write-Host '✅ Backend: FUNCIONANDO' -ForegroundColor Green; Write-Host 'Respuesta:' $response.message } catch { Write-Host '❌ Backend: NO responde' -ForegroundColor Red }"

echo.
echo [3] Estado de los procesos Node.js...
tasklist /FI "IMAGENAME eq node.exe" 2>nul
if errorlevel 1 (
    echo No hay procesos Node.js ejecutándose
) else (
    echo Procesos Node.js encontrados ^^
)

echo.
echo ========================================
echo   ENLACES DIRECTOS:
echo ========================================
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:3004
echo 💚 Health:   http://localhost:3004/health
echo ========================================

pause