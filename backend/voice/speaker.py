import os
import asyncio
import edge_tts


async def _generate(text, path):
    communicate = edge_tts.Communicate(text, voice="en-US-GuyNeural")
    await communicate.save(path)


async def text_to_speech(
    text,
    path="generated_audio/manager.mp3",
):

    os.makedirs("generated_audio", exist_ok=True)

    await _generate(text, path)
    print("TTS CALLED")
    return path
