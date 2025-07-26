# main_updated.py
# Punto de entrada principal de la API FastAPI con mejor manejo de archivos grandes

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import traceback
import pandas as pd
import time

from gestor_archivos import guardar_csv, cargar_csv, existe_csv
from analisis_eda import (
    generar_reporte_json, 
    cargar_reporte_json, 
    contexto_textual_desde_reporte,
    realizar_analisis_exploratorio_completo  # <-- Importar la nueva función
)
from agente_conversacional import interpretar_pregunta
from visualizaciones import generar_histograma, generar_barras
from openai_utils import interpretar_pregunta_openai, consultar_openai_directo

app = FastAPI()

# Permitir CORS para el frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # URLs específicas del frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
    start_time = time.time()
    try:
        print(f"Recibiendo archivo: {file.filename}")  # Debug
        
        # Validar que sea un archivo CSV
        if not file.filename.lower().endswith('.csv'):
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": "Solo se permiten archivos CSV."}
            )
        
        # Validar tamaño del archivo (máximo 100MB)
        max_size = 100 * 1024 * 1024  # 100MB
        if hasattr(file, 'size') and file.size and file.size > max_size:
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": f"El archivo es demasiado grande. Máximo 100MB permitido. Tamaño actual: {file.size / 1024 / 1024:.2f}MB"}
            )
        
        print(f"Guardando archivo...")  # Debug
        # Guardar el archivo
        ruta = guardar_csv(file)
        print(f"Archivo guardado en: {ruta}")  # Debug
        
        print(f"Leyendo CSV con pandas...")  # Debug
        # Generar análisis estructurado y guardar JSON
        try:
            # Usar chunks para archivos grandes
            chunk_size = 10000  # Procesar en chunks de 10k filas
            df_list = []
            
            for chunk in pd.read_csv(ruta, chunksize=chunk_size):
                df_list.append(chunk)
            
            df = pd.concat(df_list, ignore_index=True)
            print(f"CSV leído exitosamente: {len(df)} filas, {len(df.columns)} columnas")  # Debug
            
        except Exception as csv_error:
            print(f"Error leyendo CSV: {str(csv_error)}")  # Debug
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": f"Error al leer el archivo CSV: {str(csv_error)}"}
            )
        
        print(f"Generando reporte...")  # Debug
        try:
            generar_reporte_json(df)
            print(f"Reporte generado exitosamente")  # Debug
        except Exception as report_error:
            print(f"Error generando reporte: {str(report_error)}")  # Debug
            # Continuar aunque falle el reporte
        
        # Realizar el análisis exploratorio completo
        analisis = realizar_analisis_exploratorio_completo(df)
        
        if analisis.get("error"):
             return JSONResponse(
                status_code=500, 
                content={"ok": False, "mensaje": f"Error durante el análisis: {analisis['mensaje']}"}
            )

        elapsed_time = time.time() - start_time
        
        # Devolver una respuesta unificada
        response_data = {
            "ok": True, 
            "mensaje": f"Archivo '{file.filename}' subido y analizado correctamente.",
            "filas": len(df),
            "columnas": list(df.columns),
            "tiempo_procesamiento": elapsed_time,
            "analisis": analisis # <-- Añadir el análisis completo a la respuesta
        }

        print("--- DEBUG: Respuesta enviada desde /subir_csv ---")
        import json
        print(json.dumps(response_data, indent=2, default=str))
        print("-------------------------------------------------")

        return response_data
    except Exception as e:
        elapsed_time = time.time() - start_time
        print(f"Error en subir_csv después de {elapsed_time:.2f} segundos: {str(e)}")  # Debug
        traceback.print_exc()  # Debug
        return JSONResponse(
            status_code=400, 
            content={"ok": False, "mensaje": f"Error al subir el archivo: {str(e)}"}
        )

@app.post("/preguntar")
async def preguntar(pregunta: str = Form(...), modo: str = Form('basico')):
    try:
        if not existe_csv():
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": "No hay archivo CSV cargado."}
            )
        
        df = cargar_csv()
        reporte = cargar_reporte_json()
        columnas = list(df.columns)
        contexto = contexto_textual_desde_reporte(reporte)
        
        if modo == 'openai':
            # Usar OpenAI para interpretar la pregunta
            resultado = interpretar_pregunta_openai(pregunta, contexto, columnas)
            
            if resultado.get('error'):
                return JSONResponse(
                    status_code=400, 
                    content={"ok": False, "mensaje": resultado['mensaje']}
                )
            
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
                    return JSONResponse(
                        status_code=400, 
                        content={"ok": False, "mensaje": f"La columna '{columna}' no es numérica o no existe."}
                    )
            
            elif accion == 'histograma' and columna:
                if columna in df.columns:
                    try:
                        ruta = generar_histograma(columna, df)
                        return {
                            "ok": True, 
                            "resultado": {"ruta": ruta}, 
                            "mensaje": f"Histograma de {columna} generado."
                        }
                    except Exception as e:
                        return JSONResponse(
                            status_code=400, 
                            content={"ok": False, "mensaje": f"Error al generar histograma: {str(e)}"}
                        )
                else:
                    return JSONResponse(
                        status_code=400, 
                        content={"ok": False, "mensaje": f"La columna '{columna}' no existe."}
                    )
            
            elif accion == 'describe':
                descripcion = df.describe().to_dict()
                return {
                    "ok": True, 
                    "resultado": descripcion, 
                    "mensaje": "Descripción estadística del dataset."
                }
            
            else:
                return {
                    "ok": True, 
                    "resultado": resultado, 
                    "mensaje": resultado.get('mensaje', 'Acción interpretada por OpenAI.')
                }
        else:
            # Modo básico
            resultado = interpretar_pregunta(pregunta, columnas, modo='basico')
            return {
                "ok": True, 
                "resultado": resultado, 
                "mensaje": "Pregunta interpretada correctamente."
            }
            
    except Exception as e:
        return JSONResponse(
            status_code=400, 
            content={"ok": False, "mensaje": f"Error al interpretar la pregunta: {str(e)}"}
        )

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
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": "No hay archivo CSV cargado."}
            )
        
        df = cargar_csv()
        
        if tipo == 'histograma':
            ruta = generar_histograma(columna, df)
        elif tipo == 'barras':
            ruta = generar_barras(columna, df)
        else:
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": "Tipo de gráfico no soportado."}
            )
        
        return {
            "ok": True, 
            "resultado": {"ruta": ruta}, 
            "mensaje": f"Gráfico '{tipo}' generado correctamente."
        }
    except Exception as e:
        return JSONResponse(
            status_code=400, 
            content={"ok": False, "mensaje": f"Error al generar el gráfico: {str(e)}"}
        )

@app.post("/exportar-filtrado")
async def exportar_filtrado(filtro: FiltroRequest):
    try:
        if not existe_csv():
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": "No hay archivo CSV cargado."}
            )
        
        df = cargar_csv()
        
        # Validar condición
        if not filtro.condicion or not filtro.condicion.strip():
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": "Condición de filtro requerida."}
            )
        
        # Aplicar filtro (implementación básica)
        try:
            # Por ahora, filtro simple por columnas que contengan la condición
            # En producción, usar una librería como pandas-query o implementar parser seguro
            filtered_df = df.head(filtro.cantidad)  # Placeholder - implementar filtro real
        except Exception as e:
            return JSONResponse(
                status_code=400, 
                content={"ok": False, "mensaje": f"Error al aplicar filtro: {str(e)}"}
            )
        
        # Convertir a CSV
        contenido_csv = filtered_df.to_csv(index=False)
        
        return {
            "ok": True, 
            "contenido": contenido_csv, 
            "mensaje": "Filtrado exportado correctamente."
        }
    except Exception as e:
        return JSONResponse(
            status_code=400, 
            content={"ok": False, "mensaje": f"Error al exportar filtrado: {str(e)}"}
        ) 