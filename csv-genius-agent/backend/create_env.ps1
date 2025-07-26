# Script para crear el archivo .env en el backend
# Ejecutar este script desde la carpeta backend

$envContent = @"
# Configuración de OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Configuración del servidor
PORT=8000
HOST=0.0.0.0

# Configuración de CORS (opcional)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
"@

# Crear el archivo .env
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "Archivo .env creado exitosamente en el backend"
Write-Host "Recuerda editar el archivo y agregar tu API key real de OpenAI" 