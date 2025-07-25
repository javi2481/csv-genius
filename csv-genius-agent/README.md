# 🧠 CSV Genius Agent

Una aplicación web interactiva para análisis exploratorio de archivos CSV usando herramientas de IA, estadística y visualización de datos. Permite subir un CSV, hacer preguntas sobre él, visualizar gráficos, explorar estadísticas, limpiar datos y exportar resultados fácilmente.

---

## 🚀 Características principales

- 📤 Subida de archivos CSV
- 🤖 Preguntas sobre el dataset en lenguaje natural (modo básico y con OpenAI)
- 📊 Visualización de gráficos (histograma, barras)
- 📈 Perfilado automático del dataset
- 📌 Estadísticas por columna
- ⚖️ Comparación entre columnas
- 🔍 Filtro de filas con condiciones dinámicas
- 🧹 Limpieza de datos (eliminar/reemplazar nulos)
- 💾 Exportación de datos:
  - CSV completo
  - Subconjunto filtrado
  - Resumen como `.json` o `.txt`

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: React (con componentes modulares y reutilizables)
- **Estilos**: CSS inline centralizado + animaciones básicas
- **Backend**: Python (Flask o FastAPI) — [personalizable]
- **Análisis**: pandas, ydata-profiling, NumPy
- **Exportación**: Blob API, `toLocaleString`, manejo de archivos en navegador
- **API opcional**: OpenAI GPT (con integración flexible)

---

## 📦 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/csv-genius-agent.git
   cd csv-genius-agent
   ```

2. Instala dependencias del frontend:
   ```bash
   npm install
   ```

3. (Opcional) Instala dependencias del backend en entorno Python:
   ```bash
   pip install -r requirements.txt
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## ▶️ Uso

1. Subí un archivo `.csv`
2. Elegí una de las herramientas del menú:
   - Formular preguntas
   - Visualizar gráficos
   - Consultar estadísticas
   - Filtrar o limpiar datos
3. Exportá lo que necesites con un clic

> Tip: activá el modo OpenAI para respuestas generadas por inteligencia artificial (requiere API key)

---

## 🖼️ Capturas de pantalla *(opcional)*

Agregá capturas aquí usando Markdown:

```md
![Subida de CSV](screenshots/subida.png)
![Gráfico generado](screenshots/grafico.png)
```

---

## 📁 Estructura de carpetas

```
csv-genius-agent/
│
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   └── ...
│   ├── services/
│   ├── styles/
│   └── App.jsx
├── styles/estilosGenerales.js
├── package.json
└── README.md
```

---

## 👤 Autor

Proyecto desarrollado por **Javier Berrone**  
💻 [Perfil de GitHub](https://github.com/tuusuario)  
🧠 En colaboración con ChatGPT como prompt engineer y asistente técnico.

---

## 📄 Licencia

MIT © 2025 - Javier Berrone

---

## 🌐 Créditos especiales

- ydata-profiling
- funpymodeling
- OpenAI GPT
- pandas & NumPy

---

# CSV Genius Agent - Integración con OpenAI

## 🤖 Configuración de OpenAI

Este proyecto incluye integración con OpenAI GPT para análisis inteligente de datos CSV.

### 📋 Requisitos Previos

1. **Cuenta de OpenAI**: Necesitas una cuenta en [OpenAI](https://platform.openai.com/)
2. **API Key**: Genera una API key desde el dashboard de OpenAI
3. **Créditos**: Asegúrate de tener créditos disponibles en tu cuenta

### 🔧 Configuración del Backend

#### 1. Instalar dependencias
```bash
cd csv-genius-agent/backend
pip install -r requirements.txt
```

#### 2. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend/`:

```bash
# Copiar el archivo de ejemplo
cp env.example .env
```

Edita el archivo `.env` y agrega tu API key:
```env
# Configuración de OpenAI
OPENAI_API_KEY=sk-your-actual-api-key-here

# Configuración del servidor
PORT=8000
HOST=0.0.0.0

# Configuración de CORS (opcional)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### 3. Verificar la configuración
```bash
# Ejecutar el backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 🎨 Configuración del Frontend

#### 1. Instalar dependencias
```bash
cd csv-genius-agent/frontend
npm install
```

#### 2. Configurar variables de entorno (opcional)
Crea un archivo `.env` en la carpeta `frontend/`:

```env
# Configuración del frontend
VITE_API_BASE_URL=http://localhost:8000
VITE_MODO_OPENAI=true
VITE_APP_TITLE=CSV Genius Agent
```

#### 3. Ejecutar el frontend
```bash
npm start
```

### 🚀 Uso de OpenAI

#### Modo Básico vs OpenAI

1. **Modo Básico** (🔍):
   - Usa palabras clave para interpretar preguntas
   - Funciona sin conexión a internet
   - Respuestas más limitadas pero rápidas

2. **Modo OpenAI** (🤖):
   - Usa inteligencia artificial para interpretar preguntas complejas
   - Requiere conexión a internet y API key válida
   - Respuestas más naturales y completas

#### Ejemplos de Preguntas

**Modo Básico:**
- "¿Cuál es la media de edad?"
- "Muestra histograma de ingresos"
- "¿Cuántos valores nulos hay?"

**Modo OpenAI:**
- "¿Qué patrones observas en la distribución de edades?"
- "¿Hay correlación entre ingresos y nivel educativo?"
- "Analiza la calidad de los datos y sugiere mejoras"

### 🔐 Seguridad

- ✅ La API key **NUNCA** se expone en el frontend
- ✅ Todas las llamadas a OpenAI se hacen desde el backend
- ✅ El archivo `.env` debe estar en `.gitignore`
- ✅ Usa HTTPS en producción

### 📊 Endpoints Disponibles

#### Backend
- `POST /preguntar` - Interpreta preguntas (básico o OpenAI)
- `POST /api/openai` - Consulta directa a OpenAI
- `POST /subir_csv` - Sube archivo CSV
- `POST /graficar` - Genera gráficos

#### Frontend
- `consultarOpenAI(pregunta, contexto, modelo)` - Función para consultas directas
- `enviarPregunta(pregunta, modo)` - Función para preguntas con interpretación

### 🛠️ Solución de Problemas

#### Error: "No hay API KEY de OpenAI configurada"
1. Verifica que el archivo `.env` existe en `backend/`
2. Asegúrate de que `OPENAI_API_KEY` esté definido
3. Reinicia el servidor backend

#### Error: "Error de autenticación con OpenAI"
1. Verifica que tu API key sea válida
2. Asegúrate de tener créditos en tu cuenta
3. Revisa que la key no tenga espacios extra

#### Error: "Límite de velocidad excedido"
1. Espera unos minutos antes de hacer otra consulta
2. Considera usar un plan de pago si es frecuente

#### Error: "No se pudo conectar con el servidor"
1. Verifica que el backend esté ejecutándose en `http://localhost:8000`
2. Revisa la configuración de CORS
3. Verifica que no haya firewall bloqueando la conexión

### 💡 Consejos de Uso

1. **Optimiza tus preguntas**: Sé específico para obtener mejores respuestas
2. **Usa el contexto**: El sistema incluye información del CSV automáticamente
3. **Combina modos**: Usa básico para consultas simples, OpenAI para análisis complejos
4. **Monitorea costos**: Las llamadas a OpenAI tienen costo, úsalas responsablemente

### 🔄 Actualizaciones

Para actualizar la integración de OpenAI:

1. **Backend**: `pip install --upgrade openai`
2. **Frontend**: `npm update`
3. **Verificar**: Ejecuta las pruebas para asegurar compatibilidad

### 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa los logs del backend para errores específicos
2. Verifica la conectividad con `curl http://localhost:8000/`
3. Prueba la API de OpenAI directamente desde su dashboard

---

**Nota**: Esta integración está diseñada para ser segura y fácil de usar. La API key nunca se expone al cliente y todas las comunicaciones con OpenAI se manejan desde el backend.