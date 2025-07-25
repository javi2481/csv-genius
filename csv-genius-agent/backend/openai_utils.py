# openai_utils.py
# Este archivo contendrá funciones para interactuar con la API de OpenAI (gpt-3.5-turbo) y procesar preguntas avanzadas.

import os
import openai
from typing import Optional, Dict

# Leer la API key desde variable de entorno
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
    """
    Combina el contexto del CSV y la pregunta del usuario en un prompt para OpenAI.
    """
    prompt = (
        f"Contexto del CSV:\n{contexto}\n"
        f"Pregunta del usuario: {pregunta}\n"
        "Responde SOLO con un JSON válido con los campos 'accion', 'columna' y 'mensaje'."
    )
    return prompt


def interpretar_pregunta_openai(pregunta: str, contexto: str, columnas: Optional[list] = None, modelo: str = 'gpt-3.5-turbo') -> Dict:
    """
    Envía la pregunta y el contexto a la API de OpenAI y devuelve la interpretación como dict.
    """
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
        # Intentar parsear el JSON devuelto
        import json
        try:
            resultado = json.loads(contenido)
            # Normalizar campos esperados
            return {
                'accion': resultado.get('accion', 'desconocido'),
                'columna': resultado.get('columna'),
                'mensaje': resultado.get('mensaje', '')
            }
        except Exception:
            # Si no es JSON válido, devolver como mensaje de error
            return {
                'accion': 'desconocido',
                'columna': None,
                'mensaje': f'Respuesta no interpretable: {contenido}'
            }
    except Exception as e:
        return {
            'error': True,
            'mensaje': f'Error al comunicarse con OpenAI: {str(e)}'
        } 