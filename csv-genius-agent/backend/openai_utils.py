# openai_utils.py
# Este archivo contendrá funciones para interactuar con la API de OpenAI (gpt-3.5-turbo) y procesar preguntas avanzadas.

import os
import openai
from typing import Optional, Dict
import json
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

PROMPT_SISTEMA = (
    "Eres un asistente experto en análisis de datos. "
    "El usuario te hará preguntas sobre un archivo CSV. "
    "Debes interpretar la pregunta y devolver una instrucción clara en formato JSON con los siguientes campos: "
    "'accion' (por ejemplo: media, histograma, nulos, describe, etc.), 'columna' (si corresponde), y 'mensaje' (explicación breve en español). "
    "Si la pregunta es ambigua, pide aclaración en el campo 'mensaje'. "
    "No realices el cálculo, solo interpreta la intención."
)

def armar_prompt(contexto: str, pregunta: str) -> str:
    prompt = (
        f"Contexto del CSV:\n{contexto}\n"
        f"Pregunta del usuario: {pregunta}\n"
        "Responde SOLO con un JSON válido con los campos 'accion', 'columna' y 'mensaje'."
    )
    return prompt

def interpretar_pregunta_openai(pregunta: str, contexto: str, columnas: Optional[list] = None, modelo: str = 'gpt-3.5-turbo') -> Dict:
    if not OPENAI_API_KEY:
        return {
            'error': True,
            'mensaje': 'No hay API KEY de OpenAI configurada.'
        }
    
    prompt = armar_prompt(contexto, pregunta)
    
    try:
        respuesta = openai.ChatCompletion.create(
            model=modelo,
            messages=[
                {"role": "system", "content": PROMPT_SISTEMA},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=256
        )
        
        contenido = respuesta['choices'][0]['message']['content']
        
        try:
            resultado = json.loads(contenido)
            return {
                'accion': resultado.get('accion', 'desconocido'),
                'columna': resultado.get('columna'),
                'mensaje': resultado.get('mensaje', '')
            }
        except json.JSONDecodeError:
            return {
                'accion': 'desconocido',
                'columna': None,
                'mensaje': f'Respuesta no interpretable: {contenido}'
            }
            
    except openai.error.AuthenticationError:
        return {
            'error': True,
            'mensaje': 'Error de autenticación con OpenAI. Verifica tu API key.'
        }
    except openai.error.RateLimitError:
        return {
            'error': True,
            'mensaje': 'Límite de velocidad excedido. Intenta de nuevo en unos minutos.'
        }
    except openai.error.APIError as e:
        return {
            'error': True,
            'mensaje': f'Error de la API de OpenAI: {str(e)}'
        }
    except Exception as e:
        return {
            'error': True,
            'mensaje': f'Error al comunicarse con OpenAI: {str(e)}'
        }

def consultar_openai_directo(pregunta: str, contexto: str, modelo: str = 'gpt-3.5-turbo') -> Dict:
    """
    Función para consultas directas a OpenAI sin interpretación de intención.
    Devuelve una respuesta directa en español.
    """
    if not OPENAI_API_KEY:
        return {
            'error': True,
            'mensaje': 'No hay API KEY de OpenAI configurada.'
        }
    
    prompt_sistema = (
        "Eres un analista de datos experto. Responde las preguntas del usuario "
        "sobre los datos del CSV de manera clara y concisa en español. "
        "Si no puedes responder con la información disponible, indícalo claramente."
    )
    
    prompt_usuario = (
        f"Contexto del CSV:\n{contexto}\n\n"
        f"Pregunta del usuario: {pregunta}\n\n"
        "Responde de manera clara y útil en español."
    )
    
    try:
        respuesta = openai.ChatCompletion.create(
            model=modelo,
            messages=[
                {"role": "system", "content": prompt_sistema},
                {"role": "user", "content": prompt_usuario}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        contenido = respuesta['choices'][0]['message']['content']
        
        return {
            'ok': True,
            'respuesta': contenido,
            'modelo_usado': modelo
        }
        
    except openai.error.AuthenticationError:
        return {
            'error': True,
            'mensaje': 'Error de autenticación con OpenAI. Verifica tu API key.'
        }
    except openai.error.RateLimitError:
        return {
            'error': True,
            'mensaje': 'Límite de velocidad excedido. Intenta de nuevo en unos minutos.'
        }
    except openai.error.APIError as e:
        return {
            'error': True,
            'mensaje': f'Error de la API de OpenAI: {str(e)}'
        }
    except Exception as e:
        return {
            'error': True,
            'mensaje': f'Error al comunicarse con OpenAI: {str(e)}'
        } 