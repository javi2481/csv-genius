import streamlit as st
import pandas as pd
from agente_eda import obtener_contexto_eda
from agente_nlp import interpretar_pregunta
from graficador import generar_grafico

st.set_page_config(page_title="Análisis de Datos", page_icon=":bar_chart:", layout="wide")

st.title("Análisis de Datos")
archivo_cargado = st.file_uploader("Cargar archivo CSV", type=["csv"])

if archivo_cargado is not None:
    df = pd.read_csv(archivo_cargado)
    st.subheader("Vista previa de los datos")
    st.dataframe(df.head())

    with st.spinner("Generando análisis..."):
        contexto_eda = obtener_contexto_eda(df)
        st.success("Análisis EDA completado")

# Mostrar resumen simple
st.write("Filas", df.shape[0])
st.write("Columnas", df.shape[1])

# Pregunta al usuario

st.subheader("Hace una pregunta sobre los datos")
pregunta = st.text_input("Ejemplo: ¿Cuál es la media de la columna 'edad'?")

if pregunta:
    with st.spinner("Interpretando pregunta..."):
        respuesta = interpretar_pregunta(pregunta, df, contexto_eda)
    if isinstance(respuesta, str):
        st.write(respuesta)
    elif isinstance(respuesta, "__class__") and "matplotlib" in str(respuesta):
        st.plotly_chart(respuesta)
    else:
        st.warning("No se pudo generar la respuesta")
else:
    st.info("Sube un archivo CSV para comenzar")