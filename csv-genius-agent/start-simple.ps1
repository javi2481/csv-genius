# Script simple para iniciar el proyecto CSV Genius Agent
# Ejecutar desde la carpeta raiz del proyecto (csv-genius)

Write-Host "Iniciando CSV Genius Agent..." -ForegroundColor Green

# 1. Navegar a la carpeta del proyecto
$projectPath = "C:\Users\javie\OneDrive\Documentos\Programacion\Portfolio\IA Agent\csv-genius\csv-genius-agent"
cd $projectPath

# 2. Verificar que estamos en la carpeta correcta
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: No se encontró la estructura de carpetas 'backend' y 'frontend' en $projectPath" -ForegroundColor Red
    exit 1
}

# 3. Crear archivo .env en el backend si no existe
$backendEnvPath = Join-Path $projectPath "backend\.env"
if (-not (Test-Path $backendEnvPath)) {
    Write-Host "Creando archivo .env en el backend..." -ForegroundColor Yellow
    $envContent = "OPENAI_API_KEY=sk-your-openai-api-key-here`nPORT=8000`nHOST=0.0.0.0`nALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000"
    $envContent | Out-File -FilePath $backendEnvPath -Encoding UTF8
    Write-Host "Archivo .env creado. Recuerda agregar tu API key real de OpenAI" -ForegroundColor Green
}

# 4. Crear ambiente virtual si no existe
$venvPath = Join-Path $projectPath "venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Creando ambiente virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# 5. Activar ambiente virtual e instalar dependencias
Write-Host "Instalando dependencias del backend..." -ForegroundColor Yellow
# El & es para ejecutar el comando
& (Join-Path $venvPath "Scripts\Activate.ps1")
pip install -r (Join-Path $projectPath "backend\requirements.txt")

Write-Host "Dependencias instaladas" -ForegroundColor Green

# 6. Iniciar el backend
Write-Host "Iniciando backend en http://localhost:8000..." -ForegroundColor Yellow
$backendCommand = "cd '$projectPath\backend'; & '..\venv\Scripts\Activate.ps1'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000; Read-Host -Prompt 'Presiona Enter para cerrar esta ventana'"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

# 7. Esperar un momento para que el backend inicie
Start-Sleep -Seconds 5

# 8. Iniciar el frontend
Write-Host "Iniciando frontend en http://localhost:3000..." -ForegroundColor Yellow
# Crear .env en frontend si no existe
$frontendEnvPath = Join-Path $projectPath "frontend\.env"
if (-not (Test-Path $frontendEnvPath)) {
    Write-Host "Creando archivo .env en el frontend..." -ForegroundColor Yellow
    "REACT_APP_API_URL=http://localhost:8000" | Out-File -FilePath $frontendEnvPath -Encoding UTF8
}

$frontendCommand = "cd '$projectPath\frontend'; npm install; npm start; Read-Host -Prompt 'Presiona Enter para cerrar esta ventana'"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

Write-Host "`nProyecto iniciado correctamente!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000/docs" -ForegroundColor Cyan 