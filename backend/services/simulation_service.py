import uuid
from graph.workflow import graph
from scenarios.loader import get_random_scenario
from memory.session_store import sessions


def start_simulation():

    session_id = str(uuid.uuid4())
    scenario = get_random_scenario()
    first_question = scenario["meeting_flow"][0]["question"]
    initial_message = f"Good morning. Let's get started.\n\n{first_question}"

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
        "followup_count": 0,
        "current_followup_index": 0,
        "scenario": scenario,
    }

    sessions[session_id] = state

    return {
        "session_id": session_id,
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
        return {
            "manager_response": assistant_message,
            "interview_complete": result.get(
                "interview_complete",
                False,
            ),
        }

    except Exception as e:
        print("GRAPH ERROR:", str(e))
        return {"manager_response": f"ERROR: {str(e)}"}
