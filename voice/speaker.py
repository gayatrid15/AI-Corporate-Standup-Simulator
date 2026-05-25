import os
from elevenlabs.client import ElevenLabs
from elevenlabs import play

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))


def speak_text(text):

    try:

        audio = client.text_to_speech.convert(
            text=text, voice_id="EXAVITQu4vr4xnSDxMaL", model_id="eleven_turbo_v2_5"
        )

        play(audio)

    except Exception as e:

        print("Speech generation failed:", e)
