# agente_conversacional.py
# Este archivo contendrá la lógica para interpretar preguntas en lenguaje natural y extraer la intención del usuario.

import re
from typing import Optional, Dict

# Diccionario de palabras clave para cada intención
INTENCIONES = {
    'media': ["media", "promedio", "promediar", "average", "mean"],
    'moda': ["moda", "más frecuente", "frecuencia"],
    'mediana': ["mediana", "valor central"],
    'nulos': ["nulo", "faltante", "incompleto", "vacío", "missing"],
    'tipos': ["tipo de dato", "categoría", "categorías", "tipo", "tipos"],
    'histograma': ["histograma", "distribución"],
    'describe': ["describe", "resumen", "análisis general", "estadísticas", "summary"],
    'columnas': ["columnas", "campos", "atributos"],
}


def parser_basico(pregunta: str, columnas: Optional[list] = None) -> Dict:
    """
    Analiza la pregunta y devuelve una instrucción estructurada:
    {
        'accion': 'media' | 'moda' | 'nulos' | ...,
        'columna': 'nombre_columna' | None
    }
    Si se provee la lista de columnas, intenta extraer el nombre de columna mencionado.
    """
    pregunta_l = pregunta.lower()
    accion_detectada = None
    for accion, palabras in INTENCIONES.items():
        for palabra in palabras:
            if palabra in pregunta_l:
                accion_detectada = accion
                break
        if accion_detectada:
            break

    # Extraer nombre de columna si se provee la lista
    columna_detectada = None
    if columnas:
        for col in columnas:
            # Busca coincidencia exacta o entre comillas
            patron = rf'("|\'|\b){re.escape(col.lower())}("|\'|\b)'
            if re.search(patron, pregunta_l):
                columna_detectada = col
                break

    # Si no se detectó acción, devolver 'desconocido'
    if not accion_detectada:
        accion_detectada = 'desconocido'

    return {
        'accion': accion_detectada,
        'columna': columna_detectada
    }

# Placeholder para integración futura con OpenAI
def parser_openai(pregunta: str, contexto: str, openai_client=None) -> Dict:
    """
    Analiza la pregunta usando un modelo de lenguaje (OpenAI) y devuelve una instrucción estructurada.
    Esta función es un placeholder y debe implementarse cuando se integre openai_utils.
    """
    # Aquí se llamaría a openai_utils con el contexto y la pregunta
    # y se parsearía la respuesta para extraer la acción y columna.
    return {
        'accion': 'desconocido',
        'columna': None,
        'detalle': 'Parser OpenAI no implementado aún.'
    }


def interpretar_pregunta(pregunta: str, columnas: Optional[list] = None, modo: str = 'basico', contexto: str = '', openai_client=None) -> Dict:
    """
    Interfaz principal para interpretar preguntas.
    - modo='basico': usa parser por palabras clave.
    - modo='openai': usa parser avanzado (si está implementado).
    """
    if modo == 'openai':
        return parser_openai(pregunta, contexto, openai_client)
    else:
        return parser_basico(pregunta, columnas) 