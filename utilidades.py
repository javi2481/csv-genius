import re
import pandas as pd

def normalizar_pregunta(pregunta):
    """ Pasa a minusculas y elimina signos de puntuacion, espacios en blanco, etc. """
    pregunta = pregunta.lower()
    pregunta = re.sub(r'[^a-z0-9\s]', '', pregunta)
    return pregunta

def validar_columna(columna, pregunta):
    """ Valida si la columna existe en el dataset """
    return columna in pregunta

def detectar_tipo_variable(serie: pd.Series):
    """ Detecta el tipo de variable (categorica, numerica, etc.) """
    if pd.api.types.is_numeric_dtype(serie):
        return "numerica"
    elif pd.api.types.is_object_dtype(serie):
        return "categorica"
    else:
        return "otro"
