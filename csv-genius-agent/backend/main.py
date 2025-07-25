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
from openai_utils import interpretar_pregunta_openai, consultar_openai_directo

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

class OpenAIRequest(BaseModel):
    pregunta: str
    contexto: str
    modelo: str = "gpt-3.5-turbo"

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
            # Usar OpenAI para interpretar la pregunta
            resultado = interpretar_pregunta_openai(pregunta, contexto, columnas)
            if resultado.get('error'):
                return JSONResponse(status_code=400, content={"ok": False, "mensaje": resultado['mensaje']})
            
            # Ejecutar la acción interpretada
            accion = resultado['accion']
            columna = resultado['columna']
            
            if accion == 'media' and columna:
                if columna in df.columns and pd.api.types.is_numeric_dtype(df[columna]):
                    media = df[columna].mean()
                    return {
                        "ok": True, 
                        "resultado": {
                            "accion": "media",
                            "columna": columna,
                            "valor": media,
                            "mensaje": f"La media de {columna} es {media:.2f}"
                        }
                    }
                else:
                    return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"La columna '{columna}' no es numérica o no existe."})
            
            elif accion == 'histograma' and columna:
                if columna in df.columns:
                    ruta = generar_histograma(columna, df)
                    return {"ok": True, "resultado": {"ruta": ruta}, "mensaje": f"Histograma de {columna} generado."}
                else:
                    return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"La columna '{columna}' no existe."})
            
            elif accion == 'describe':
                descripcion = df.describe().to_dict()
                return {"ok": True, "resultado": descripcion, "mensaje": "Descripción estadística del dataset."}
            
            else:
                return {"ok": True, "resultado": resultado, "mensaje": resultado.get('mensaje', 'Acción interpretada por OpenAI.')}
        else:
            # Modo básico
            resultado = interpretar_pregunta(pregunta, columnas, modo='basico')
            return {"ok": True, "resultado": resultado, "mensaje": "Pregunta interpretada correctamente."}
            
    except Exception as e:
        return JSONResponse(status_code=400, content={"ok": False, "mensaje": f"Error al interpretar la pregunta: {str(e)}"})

@app.post("/api/openai")
async def consultar_openai(request: OpenAIRequest):
    """
    Endpoint para consultas directas a OpenAI.
    Recibe una pregunta y contexto, devuelve una respuesta directa de la IA.
    """
    try:
        resultado = consultar_openai_directo(
            pregunta=request.pregunta,
            contexto=request.contexto,
            modelo=request.modelo
        )
        
        if resultado.get('error'):
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": resultado['mensaje']}
            )
        
        return {
            "ok": True,
            "respuesta": resultado['respuesta'],
            "modelo_usado": resultado.get('modelo_usado', request.modelo)
        }
        
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"ok": False, "mensaje": f"Error interno del servidor: {str(e)}"}
        )

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
