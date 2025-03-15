import os
import time
import pygame # type: ignore
from fastapi import FastAPI, File, UploadFile # type: ignore
from fastapi.responses import JSONResponse # type: ignore
from gtts import gTTS # type: ignore
import speech_recognition as sr # type: ignore
from googletrans import LANGUAGES, Translator # type: ignore
from pydub import AudioSegment # type: ignore

# Initialize Translator & Audio
translator = Translator()
pygame.mixer.init()

app = FastAPI()

# Language Mapping
language_mapping = {name: code for code, name in LANGUAGES.items()}

def get_language_code(language_name):
    return language_mapping.get(language_name, language_name)

def translator_function(spoken_text, from_language, to_language):
    return translator.translate(spoken_text, src=from_language, dest=to_language).text

def text_to_voice(text_data, to_language):
    myobj = gTTS(text=text_data, lang=to_language, slow=False)
    myobj.save("cache_file.mp3")
    pygame.mixer.Sound("cache_file.mp3").play()
    os.remove("cache_file.mp3")

@app.post("/translate/")
async def translate_audio(file: UploadFile, from_language: str, to_language: str):
    try:
        # Save the uploaded file
        file_location = f"temp_audio.wav"
        with open(file_location, "wb") as f:
            f.write(await file.read())

        # Convert to required format
        audio = AudioSegment.from_file(file_location)
        audio.export("converted_audio.wav", format="wav")

        # Speech Recognition
        rec = sr.Recognizer()
        with sr.AudioFile("converted_audio.wav") as source:
            audio_data = rec.record(source)
            spoken_text = rec.recognize_google(audio_data, language=from_language)

        # Translate Text
        translated_text = translator_function(spoken_text, from_language, to_language)

        # Convert to Speech
        text_to_voice(translated_text, to_language)

        return JSONResponse(content={"translated_text": translated_text})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
 