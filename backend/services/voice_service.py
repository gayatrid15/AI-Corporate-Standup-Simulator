import os
import uuid

from memory.session_store import sessions
from graph.workflow import graph
from voice.transcriber import transcribe_audio
from voice.speaker import text_to_speech


def process_voice(session_id, audio_file):

    state = sessions.get(session_id)

    if not state:
        return {"error": "Invalid session"}

    os.makedirs("temp_audio", exist_ok=True)

    audio_path = f"temp_audio/{uuid.uuid4()}.webm"

    with open(audio_path, "wb") as f:
        f.write(audio_file)

    user_text = transcribe_audio(audio_path)

    if not user_text:
        return {"error": "Could not transcribe audio"}

    state["messages"].append(
        {
            "role": "user",
            "content": user_text,
        }
    )

    state["candidate_claims"].append(user_text)

    updated_state = graph.invoke(state)

    sessions[session_id] = updated_state

    manager_message = updated_state["messages"][-1]["content"]

    audio_output_path = f"generated_audio/{uuid.uuid4()}.mp3"

    text_to_speech(
        manager_message,
        audio_output_path,
    )

    return {
        "transcript": user_text,
        "manager_response": manager_message,
        "audio_path": audio_output_path,
    }
