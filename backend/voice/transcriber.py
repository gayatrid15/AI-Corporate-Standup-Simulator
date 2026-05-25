import os
from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

INVALID_TRANSCRIPTS = [
    "",
    ".",
    "...",
    "you",
    "thank you",
]

INCOMPLETE_ENDINGS = [
    "uh",
    "uh-",
    "um",
    "um-",
]


def is_valid_transcript(text):

    if text is None:
        return False

    cleaned = text.strip().lower()

    if cleaned in INVALID_TRANSCRIPTS:
        return False

    if len(cleaned) < 5:
        return False

    if len(cleaned.split()) < 5:
        return False

    for ending in INCOMPLETE_ENDINGS:

        if cleaned.endswith(ending):
            return False

    return True


def transcribe_audio(audio_path):

    try:

        with open(audio_path, "rb") as audio_file:

            transcription = client.speech_to_text.convert(
                file=audio_file,
                model_id="scribe_v1",
                language_code="eng",
            )

        text = transcription.text.strip()

        print("TRANSCRIPT:", text)

        if not is_valid_transcript(text):
            return None

        return text

    except Exception as e:

        print("Transcription failed:", e)

        return None
