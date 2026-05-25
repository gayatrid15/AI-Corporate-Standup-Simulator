import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # default professional female voice (Rachel-like)


def text_to_speech(text, path="voice_recordings/manager.mp3"):

    os.makedirs("voice_recordings", exist_ok=True)

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception(f"ElevenLabs TTS failed: {response.text}")

    with open(path, "wb") as f:
        f.write(response.content)

    return path
