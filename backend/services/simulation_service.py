from graph.workflow import graph
from scenarios.loader import get_random_scenario


def process_message(user_message):

    scenario = get_random_scenario()

    initial_state = {
        "messages": [
            {
                "role": "user",
                "content": user_message,
            }
        ],
        "scenario": scenario,
        "current_question_index": 0,
        "followup_count": 0,
        "current_followup_index": 0,
        "evaluation_notes": [],
        "evaluation_flags": [],
        "interview_complete": False,
    }

    try:

        result = graph.invoke(initial_state)

        print("GRAPH RESULT:", result)

        if result is None:
            return {"manager_response": "Graph returned None"}

        messages = result.get("messages", [])

        assistant_message = ""

        if messages:
            assistant_message = messages[-1]["content"]

        return {"manager_response": assistant_message}

    except Exception as e:

        print("GRAPH ERROR:", str(e))

        return {"manager_response": f"ERROR: {str(e)}"}
