import os
import uuid

from graph.workflow import graph
from scenarios.loader import get_scenario_by_role
from memory.session_store import sessions
from agents.manager_agent import manager_start_meeting

from voice.transcriber import transcribe_audio
from voice.speaker import text_to_speech

from evaluation.report_evaluator import generate_report
from evaluation.report_generator import generate_pdf

from database.session_repository import save_interview_results


def start_simulation(session_id, candidate_role):

    print("ROLE RECEIVED:", repr(candidate_role))

    ROLE_MAP = {
        "Backend Developer": "backend_developer",
        "Frontend Developer": "frontend_developer",
        "Full Stack Developer": "full_stack_developer",
        "DevOps Engineer": "devops_engineer",
        "QA Engineer": "qa_engineer",
        "Data Engineer": "data_engineer",
    }

    candidate_role = ROLE_MAP.get(
        candidate_role,
        candidate_role,
    )

    scenario = get_scenario_by_role(candidate_role)

    first_question = scenario["meeting_flow"][0]["question"]

    initial_message = manager_start_meeting(
        candidate_role=candidate_role,
        scenario=scenario,
        first_question=first_question,
    )

    state = {
        "messages": [
            {
                "role": "assistant",
                "content": initial_message,
            }
        ],
        "candidate_claims": [],
        "contradictions": [],
        "evaluation_notes": [],
        "evaluation_flags": [],
        "conversation_started": True,
        "interview_complete": False,
        "current_question_index": 0,
        "current_question_text": first_question,
        "followup_count": 0,
        "current_followup_index": 0,
        "scenario": scenario,
        "candidate_role": candidate_role,
        "engagement_score": 100,
        "disengagement_count": 0,
        "continue_check_required": False,
        "final_report": None,
    }

    print("STATE ROLE:", state["candidate_role"])
    print("SCENARIO:", scenario["title"])
    print("ROLE:", candidate_role)

    sessions[session_id] = state

    return {
        "session_id": session_id,
        "candidate_role": candidate_role,
        "scenario_title": scenario["title"],
        "candidate_context": scenario["candidate_context"],
        "manager_message": initial_message,
    }


def _build_transcript(messages):

    transcript = []

    for msg in messages:

        speaker = "Manager" if msg["role"] == "assistant" else "Candidate"

        transcript.append(f"{speaker}: {msg['content']}")

    return transcript


def _finalize_interview(
    session_id,
    state,
):
    if state.get("final_report") is not None:
        return state

    print("YOUR INTERVIEW COMPLETED")

    report = generate_report(state)

    transcript = _build_transcript(state["messages"])

    pdf_path = generate_pdf(
        session_id=session_id,
        report=report,
        transcript=transcript,
    )

    print(pdf_path)

    report["pdf_path"] = pdf_path

    state["final_report"] = report

    sessions[session_id] = state

    save_interview_results(
        session_id=session_id,
        transcript_json=state["messages"],
        report_json=report,
        pdf_path=pdf_path,
    )

    return state


def _process_candidate_response(
    session_id,
    user_text,
):
    state = sessions.get(session_id)

    if not state:
        return None

    state["messages"].append(
        {
            "role": "user",
            "content": user_text,
        }
    )

    state["candidate_claims"].append(user_text)

    result = graph.invoke(state)

    sessions[session_id] = result

    return result


def process_message(
    session_id,
    user_message,
):
    try:

        result = _process_candidate_response(
            session_id,
            user_message,
        )

        if result is None:
            return {"error": "Invalid session"}

        if result.get("interview_complete"):
            result = _finalize_interview(
                session_id,
                result,
            )

        assistant_message = result["messages"][-1]["content"]

        return {
            "manager_response": assistant_message,
            "interview_complete": result.get(
                "interview_complete",
                False,
            ),
            "report": result.get(
                "final_report",
                None,
            ),
        }

    except Exception as e:

        print(
            "GRAPH ERROR:",
            str(e),
        )

        return {"manager_response": f"ERROR: {str(e)}"}


async def process_voice(
    session_id,
    audio_file,
):
    try:

        state = sessions.get(session_id)

        if not state:
            return {"error": "Invalid session"}

        os.makedirs(
            "candidate_audio",
            exist_ok=True,
        )

        os.makedirs(
            "generated_audio",
            exist_ok=True,
        )

        audio_path = f"candidate_audio/" f"{uuid.uuid4()}.webm"

        with open(
            audio_path,
            "wb",
        ) as f:
            f.write(audio_file)

        user_text = transcribe_audio(audio_path)

        if not user_text:
            return {"error": "Could not transcribe audio"}

        result = _process_candidate_response(
            session_id,
            user_text,
        )

        if result is None:
            return {"error": "Invalid session"}

        if result.get("interview_complete"):
            print("YOUR INTERVIEW COMPLETED")

            result = _finalize_interview(
                session_id,
                result,
            )

        manager_message = result["messages"][-1]["content"]

        audio_output_path = f"generated_audio/" f"{uuid.uuid4()}.mp3"

        await text_to_speech(
            manager_message,
            audio_output_path,
        )

        print(
            "REPORT EXISTS:",
            result.get("final_report"),
        )

        return {
            "transcript": user_text,
            "manager_response": manager_message,
            "audio_path": audio_output_path,
            "interview_complete": result.get(
                "interview_complete",
                False,
            ),
            "report": result.get(
                "final_report",
                None,
            ),
        }

    except Exception as e:

        print(
            "VOICE ERROR:",
            str(e),
        )

        return {"error": str(e)}


def force_end_session(
    session_id,
):

    state = sessions.get(session_id)

    if not state:
        return {
            "success": False,
            "message": "Invalid session",
        }

    if state.get("final_report") is not None:
        return {"success": True}

    state["interview_complete"] = True

    state = _finalize_interview(
        session_id,
        state,
    )

    return {"success": True}
