import os
import asyncio
import edge_tts


async def _generate(text, path):
    communicate = edge_tts.Communicate(text, voice="en-US-GuyNeural")
    await communicate.save(path)


def text_to_speech(text, path="voice_recordings/manager.mp3"):

    os.makedirs("voice_recordings", exist_ok=True)

    asyncio.run(_generate(text, path))
    print("TTS CALLED")
    return path
