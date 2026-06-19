from langgraph.graph import StateGraph, END

from memory.session_state import SessionState
from agents.manager_agent import manager_response
from evaluation.evaluator import evaluate_response


def complete_interview(state):

    completion_message = (
        "Alright, thanks for the update. "
        "That covers everything from my side for today."
    )

    state["messages"].append(
        {
            "role": "assistant",
            "content": completion_message,
        }
    )

    state["interview_complete"] = True

    return state


def conversation_node(state):

    # ==========================================
    # SAFETY CHECKS
    # ==========================================

    messages = state.get("messages", [])
    if not messages:
        return state
    latest_message = messages[-1]
    user_input = latest_message.get("content", "").strip()
    lower_input = user_input.lower()
    if lower_input in [
        "3",
        "end",
        "end simulation",
        "quit",
        "exit",
    ]:
        return complete_interview(state)
    if latest_message.get("role") != "user" or not user_input:
        return state

    # ==========================================
    # FLOW STATE
    # ==========================================

    scenario = state["scenario"]

    meeting_flow = scenario["meeting_flow"]

    current_question_index = state.get("current_question_index", 0)

    followup_count = state.get("followup_count", 0)

    current_followup_index = state.get(
        "current_followup_index",
        0,
    )

    # ==========================================
    # INTERVIEW COMPLETE CHECK
    # ==========================================

    if current_question_index >= len(meeting_flow):

        return complete_interview(state)

    # ==========================================
    # CURRENT ITEM
    # ==========================================

    current_item = meeting_flow[current_question_index]

    # ==========================================
    # EVALUATE RESPONSE
    # ==========================================

    evaluation = evaluate_response(
        state=state,
        user_input=user_input,
        current_item=current_item,
    )

    state["evaluation_notes"].extend(evaluation.get("notes", []))

    needs_followup = evaluation.get(
        "needs_followup",
        False,
    )

    if state.get("continue_check_required"):

        response = (
            "I notice you may not want to continue this discussion.\n\n"
            "Would you like to:\n"
            "1. Continue the meeting\n"
            "2. End the simulation"
        )

        state["messages"].append(
            {
                "role": "assistant",
                "content": response,
            }
        )

        state["continue_check_required"] = False

        return state

    # ==========================================
    # FOLLOWUP LOGIC
    # ==========================================

    can_followup = (
        needs_followup
        and followup_count < 2
        and current_followup_index < len(current_item["followups"])
    )

    if can_followup:

        next_question = current_item["followups"][current_followup_index]
        state["current_question_text"] = next_question
        response = manager_response(
            state=state,
            user_input=user_input,
            question_to_ask=next_question,
            is_followup=True,
        )

        state["messages"].append(
            {
                "role": "assistant",
                "content": response,
            }
        )

        state["followup_count"] += 1
        state["current_followup_index"] += 1

        return state

    # ==========================================
    # MOVE TO NEXT QUESTION
    # ==========================================

    state["current_question_index"] += 1
    state["followup_count"] = 0
    state["current_followup_index"] = 0

    # ==========================================
    # INTERVIEW COMPLETE AFTER ADVANCE
    # ==========================================

    if state["current_question_index"] >= len(meeting_flow):

        return complete_interview(state)

    # ==========================================
    # NEXT QUESTION
    # ==========================================

    next_item = meeting_flow[state["current_question_index"]]

    next_question = next_item["question"]

    # store the question we are about to ask
    state["current_question_text"] = next_question

    response = manager_response(
        state=state,
        user_input=user_input,
        question_to_ask=next_question,
        is_followup=False,
    )

    state["messages"].append(
        {
            "role": "assistant",
            "content": response,
        }
    )

    return state


workflow = StateGraph(SessionState)

workflow.add_node(
    "conversation",
    conversation_node,
)

workflow.set_entry_point("conversation")

workflow.add_edge("conversation", END)

graph = workflow.compile()

png_bytes = graph.get_graph().draw_mermaid_png()

with open("workflow.png", "wb") as f:
    f.write(png_bytes)
