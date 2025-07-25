# main.py
# Punto de entrada principal de la API FastAPI. Aquí se definirán los endpoints y la configuración general del backend.

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import traceback
import pandas as pd

from gestor_archivos import guardar_csv, cargar_csv, existe_csv
from analisis_eda import generar_reporte_json, cargar_reporte_json, contexto_textual_desde_reporte
from agente_conversacional import interpretar_pregunta
from visualizaciones import generar_histograma, generar_barras
from openai_utils import interpretar_pregunta_openai

app = FastAPI()

# Permitir CORS para el frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a la URL del frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FiltroRequest(BaseModel):
    condicion: str
    cantidad: int

@app.get("/")
def root():
    return {"ok": True, "mensaje": "API de CSV Genius Agent activa."}

@app.post("/subir_csv")
async def subir_csv(file: UploadFile = File(...)):
    try:
        ruta = guardar_csv(file)
        # Generar análisis estructurado y guardar JSON
        import pandas as pd
        df = pd.read_csv(ruta)
        generar_reporte_json(df)
        return {"ok": True, "mensaje": f"Archivo '{file.filename}' subido y analizado correctamente."}
    except Exception as e:
        return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"Error al subir el archivo: {str(e)}"})

@app.post("/preguntar")
async def preguntar(pregunta: str = Form(...), modo: str = Form('basico')):
    try:
        if not existe_csv():
            return JSONResponse(status_code=400, content={"ok": False, "mensaje": "No hay archivo CSV cargado."})
        df = cargar_csv()
        reporte = cargar_reporte_json()
        columnas = list(df.columns)
        contexto = contexto_textual_desde_reporte(reporte)
        if modo == 'openai':
            resultado = interpretar_pregunta_openai(pregunta, contexto, columnas)
        else:
            resultado = interpretar_pregunta(pregunta, columnas, modo='basico')
        return {"ok": True, "resultado": resultado, "mensaje": "Pregunta interpretada correctamente."}
    except Exception as e:
        return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"Error al interpretar la pregunta: {str(e)}"})

@app.post("/graficar")
async def graficar(tipo: str = Form(...), columna: str = Form(...)):
    try:
        if not existe_csv():
            return JSONResponse(status_code=400, content={"ok": False, "mensaje": "No hay archivo CSV cargado."})
        df = cargar_csv()
        if tipo == 'histograma':
            ruta = generar_histograma(columna, df)
        elif tipo == 'barras':
            ruta = generar_barras(columna, df)
        else:
            return JSONResponse(status_code=400, content={"ok": False, "mensaje": "Tipo de gráfico no soportado."})
        return {"ok": True, "resultado": {"ruta": ruta}, "mensaje": f"Gráfico '{tipo}' generado correctamente."}
    except Exception as e:
        return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"Error al generar el gráfico: {str(e)}"})

@app.post("/exportar-filtrado")
async def exportar_filtrado(filtro: FiltroRequest):
    try:
        if not existe_csv():
            return JSONResponse(status_code=400, content={"ok": False, "mensaje": "No hay archivo CSV cargado."})
        
        df = cargar_csv()
        
        # Validar condición (implementación básica - se puede mejorar)
        if not filtro.condicion or not filtro.condicion.strip():
            return JSONResponse(status_code=400, content={"ok": False, "mensaje": "Condición de filtro requerida."})
        
        # Aplicar filtro (implementación básica - se puede mejorar con eval seguro)
        try:
            # Por ahora, filtro simple por columnas que contengan la condición
            # En producción, usar una librería como pandas-query o implementar parser seguro
            filtered_df = df.head(filtro.cantidad)  # Placeholder - implementar filtro real
        except Exception as e:
            return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"Error al aplicar filtro: {str(e)}"})
        
        # Convertir a CSV
        contenido_csv = filtered_df.to_csv(index=False)
        
        return {"ok": True, "contenido": contenido_csv, "mensaje": "Filtrado exportado correctamente."}
    except Exception as e:
        return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"Error al exportar filtrado: {str(e)}"})
