from flask import Flask
from flask_cors import CORS
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
import io
import difflib
import replicate
from nicegui import app, ui

# Texto esperado para la evaluación
TEXTO_ESPERADO = "La inteligencia artificial transforma la forma en que vivimos."

# Crear la aplicación Flask y habilitar CORS
flask_app = Flask(__name__)
CORS(flask_app)  # Habilita CORS para todas las rutas

# Configurar FastAPI + NiceGUI
ng_app: FastAPI = app

@ng_app.post("/evaluar")
async def evaluar(audio: UploadFile):
    try:
        content = await audio.read()

        # Cargar modelo Whisper en Replicate
        client = replicate.Client(api_token="tu_token_aqui")  # Asegúrate de incluir tu token aquí
        model = client.models.get("openai/whisper")
        version = model.versions.get("30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed")
        
        # Realizar la predicción
        prediction = await app.run.io_bound(version.predict, audio=io.BytesIO(content))
        transcripcion = prediction.get("transcription", "").strip()

        # Evaluar puntaje de similitud
        similarity = difflib.SequenceMatcher(None, TEXTO_ESPERADO.lower(), transcripcion.lower()).ratio()
        puntaje = round(similarity * 100)

        return JSONResponse(content={
            "transcripcion": transcripcion,
            "puntaje": puntaje
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Si también quieres ver una interfaz simple de prueba:
with ui.column():
    ui.label("Servidor de evaluación de voz activo").classes("text-2xl")

# Ejecutar la aplicación NiceGUI
ui.run(port=5000)
