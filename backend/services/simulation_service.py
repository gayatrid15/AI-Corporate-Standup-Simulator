import uuid
from graph.workflow import graph
from scenarios.loader import get_scenario_by_role
from memory.session_store import sessions
from agents.manager_agent import manager_start_meeting
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
        "final_report": {},
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


def process_message(session_id, user_message):

    state = sessions.get(session_id)
    if not state:
        return {"error": "Invalid session"}

    state["messages"].append(
        {
            "role": "user",
            "content": user_message,
        }
    )

    state["candidate_claims"].append(user_message)
    try:
        result = graph.invoke(state)
        sessions[session_id] = result
        assistant_message = result["messages"][-1]["content"]

        if result.get("interview_complete"):

            report = generate_report(result)

            transcript = []

            for msg in result["messages"]:

                speaker = "Manager" if msg["role"] == "assistant" else "Candidate"

                transcript.append(f"{speaker}: {msg['content']}")

            pdf_path = generate_pdf(
                session_id=session_id,
                report=report,
                transcript=transcript,
            )

            report["pdf_path"] = pdf_path

            result["final_report"] = report

            sessions[session_id] = result

            save_interview_results(
                session_id=session_id,
                transcript_json=result["messages"],
                report_json=report,
                pdf_path=pdf_path,
            )

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
        print("GRAPH ERROR:", str(e))
        return {"manager_response": f"ERROR: {str(e)}"}
