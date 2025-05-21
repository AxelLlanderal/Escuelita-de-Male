from nicegui import ui
import speech_recognition as sr
from difflib import SequenceMatcher
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import io


REFERENCE_TEXT = (
    "Paco el Chato vivía en el campo. Cuando cumplió 6 años, fue a la ciudad con su papá para ir a la escuela. "
    "El primer día, su abuelita le dijo: “Espérame en la puerta.” "
    "Paco se distrajo, caminó y se perdió. "
    "Un policía lo ayudó, pero Paco no sabía su nombre completo ni su dirección. "
    "Lo llevaron a la radio para buscar a su familia. "
    "Su abuelita escuchó el mensaje y fue por él. "
    "Paco se alegró mucho y prometió aprender su nombre y dirección."
)

SAMPLE_RATE = 16000
CHANNELS = 1

recording = False
recorded_audio = []
audio_stream = None

def compare_text(audio_text, reference_text):
    return SequenceMatcher(None, audio_text, reference_text).ratio() * 100

def audio_callback(indata, frames, time, status):
    if recording:
        recorded_audio.append(indata.copy())

def start_recording():
    global recording, recorded_audio, audio_stream
    recorded_audio = []
    recording = True
    ui.notify('🎙️ Grabando... Presiona "Detener y Verificar"', color='blue', duration=3)
    try:
        audio_stream = sd.InputStream(callback=audio_callback, channels=CHANNELS, samplerate=SAMPLE_RATE)
        audio_stream.start()
    except Exception as e:
        result_label.text = f'⚠️ Error iniciando grabación: {e}'

def stop_and_verify():
    global recording, audio_stream
    recording = False

    if audio_stream:
        audio_stream.stop()
        audio_stream.close()

    if not recorded_audio:
        result_label.text = '⚠️ No se grabó ningún audio.'
        return

    audio_np = np.concatenate(recorded_audio, axis=0)
    buffer = io.BytesIO()
    wav.write(buffer, SAMPLE_RATE, (audio_np * 32767).astype(np.int16))
    buffer.seek(0)

    recognizer = sr.Recognizer()
    with sr.AudioFile(buffer) as source:
        audio = recognizer.record(source)

    try:
        recognized_text = recognizer.recognize_google(audio, language='es-ES')
        similarity_score = compare_text(recognized_text, REFERENCE_TEXT)
        result_label.text = (
            f'✅ Texto reconocido:\n"{recognized_text}"\n\n'
            f'📊 Puntaje de similitud: {similarity_score:.2f}%'
        )
        result_label.style('border: 3px solid #FFD700; padding: 15px; background: #FFF9C4; border-radius: 15px; font-size: 1.1em; white-space: pre-wrap;')
    except sr.UnknownValueError:
        result_label.text = '⚠️ No se pudo reconocer el audio. ¡Inténtalo de nuevo!'
    except sr.RequestError as e:
        result_label.text = f'⚠️ Error en el servicio de reconocimiento de voz: {e}'
    except Exception as e:
        result_label.text = f'⚠️ Error inesperado: {e}'

# Interfaz gráfica con NiceGUI
with ui.card().style('max-width: 800px; margin: auto; padding: 40px; border-radius: 25px; box-shadow: 0px 6px 15px rgba(0,0,0,0.3); background: linear-gradient(135deg, #FF9A9E, #FAD0C4); color: black;'):
    ui.label('🎤 Reconocimiento de voz: Paco el Chato').classes('text-3xl font-bold text-center mb-6')
    ui.label('Graba tu voz y compárala con el siguiente texto:').classes('text-center italic text-lg mb-4')
    with ui.row():
        ui.label(REFERENCE_TEXT).classes('w-full bg-gray-200 text-black rounded-lg p-3 text-justify')
    with ui.row().classes('justify-center gap-6 mt-6'):
        ui.button('🎙️ Grabar', on_click=start_recording).classes(
            'py-3 px-6 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-white text-lg hover:scale-110 transition-transform duration-200'
        )
        ui.button('⏸️ Detener y Verificar', on_click=stop_and_verify).classes(
            'py-3 px-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white text-lg hover:scale-110 transition-transform duration-200'
        )
    result_label = ui.label().classes('mt-8 text-center text-xl font-bold')

ui.run()
