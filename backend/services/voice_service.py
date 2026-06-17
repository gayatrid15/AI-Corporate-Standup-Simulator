import os
import uuid

from memory.session_store import sessions
from graph.workflow import graph
from voice.transcriber import transcribe_audio
from voice.speaker import text_to_speech
from evaluation.report_evaluator import generate_report
from evaluation.report_generator import generate_pdf
from database.session_repository import save_interview_results


async def process_voice(session_id, audio_file):
    state = sessions.get(session_id)

    if not state:
        return {"error": "Invalid session"}

    os.makedirs("candidate_audio", exist_ok=True)
    audio_path = f"candidate_audio/{uuid.uuid4()}.webm"

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

    if updated_state.get("interview_complete"):
        print("YOUR INTERVIEW COMPLETED")
        report = generate_report(updated_state)
        transcript = []

        for msg in updated_state["messages"]:
            speaker = "Manager" if msg["role"] == "assistant" else "Candidate"
            transcript.append(f"{speaker}: {msg['content']}")

        pdf_path = generate_pdf(
            session_id=session_id,
            report=report,
            transcript=transcript,
        )
        print(pdf_path)
        report["pdf_path"] = pdf_path
        updated_state["final_report"] = report
        sessions[session_id] = updated_state

        save_interview_results(
            session_id=session_id,
            transcript_json=updated_state["messages"],
            report_json=report,
            pdf_path=pdf_path,
        )

    manager_message = updated_state["messages"][-1]["content"]
    audio_output_path = f"generated_audio/{uuid.uuid4()}.mp3"

    await text_to_speech(
        manager_message,
        audio_output_path,
    )

    print("REPORT EXISTS:", updated_state.get("final_report"))

    return {
        "transcript": user_text,
        "manager_response": manager_message,
        "audio_path": audio_output_path,
        "interview_complete": updated_state.get(
            "interview_complete",
            False,
        ),
        "report": updated_state.get(
            "final_report",
            None,
        ),
    }
