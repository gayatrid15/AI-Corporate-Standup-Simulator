import json

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.1,
)


REFUSAL_PHRASES = [
    "no",
    "nope",
    "idk",
    "i dont know",
    "i don't know",
    "not sure",
    "no idea",
    "can't answer",
    "cannot answer",
    "skip",
    "pass",
    "whatever",
    "hi",
    "hello",
]


def calculate_engagement_metrics(state):

    candidate_messages = [
        msg["content"].strip().lower()
        for msg in state["messages"]
        if msg["role"] == "user"
    ]

    total_messages = len(candidate_messages)

    if total_messages == 0:
        return {
            "meaningful_ratio": 0,
            "refusal_ratio": 100,
            "total_messages": 0,
        }

    meaningful = 0
    refusals = 0

    for msg in candidate_messages:

        words = msg.split()

        if msg in REFUSAL_PHRASES:
            refusals += 1

        if len(words) >= 5:
            meaningful += 1

    return {
        "meaningful_ratio": round(
            (meaningful / total_messages) * 100,
            2,
        ),
        "refusal_ratio": round(
            (refusals / total_messages) * 100,
            2,
        ),
        "total_messages": total_messages,
    }


def generate_report(state):

    metrics = calculate_engagement_metrics(state)

    meaningful_ratio = metrics["meaningful_ratio"]
    refusal_ratio = metrics["refusal_ratio"]
    total_messages = metrics["total_messages"]

    transcript = "\n".join(
        [f"{msg['role']}: {msg['content']}" for msg in state["messages"]]
    )

    # =====================================
    # HARD FAILURE CHECK
    # =====================================

    if meaningful_ratio < 20:

        return {
            "overall_score": 15,
            "communication": 2,
            "confidence": 2,
            "technical_reasoning": 1,
            "ownership": 1,
            "problem_solving": 1,
            "professionalism": 3,
            "strengths": ["Participated in the session"],
            "improvements": [
                "Provide meaningful answers",
                "Engage with questions",
                "Demonstrate technical reasoning",
                "Communicate more clearly",
            ],
            "summary": "The candidate did not provide enough meaningful responses "
            "to perform a reliable evaluation. Most answers were extremely "
            "short, non-technical, or unrelated to the discussion topics.",
            "engagement_score": meaningful_ratio,
            "insufficient_participation": True,
            "meaningful_ratio": meaningful_ratio,
            "refusal_ratio": refusal_ratio,
            "total_candidate_messages": total_messages,
            "evaluation_flags": state["evaluation_flags"],
        }

    prompt = f"""
You are a strict corporate interview evaluator.

IMPORTANT:

If the candidate avoided questions,
gave one-word answers,
or failed to explain reasoning,
scores MUST be reduced.

Do NOT be generous.

Role:
{state["candidate_role"]}

Meaningful Response Ratio:
{meaningful_ratio}

Refusal Ratio:
{refusal_ratio}

Transcript:
{transcript}

Evaluation Notes:
{state["evaluation_notes"]}

Evaluation Flags:
{state["evaluation_flags"]}

Return ONLY valid JSON.

{{
  "overall_score": 0,
  "communication": 0,
  "confidence": 0,
  "technical_reasoning": 0,
  "ownership": 0,
  "problem_solving": 0,
  "professionalism": 0,
  "strengths": [],
  "improvements": [],
  "summary": ""
}}
"""

    response = llm.invoke([SystemMessage(content=prompt)])

    try:

        report = json.loads(response.content)

        report["engagement_score"] = meaningful_ratio
        report["meaningful_ratio"] = meaningful_ratio
        report["refusal_ratio"] = refusal_ratio
        report["total_candidate_messages"] = total_messages
        report["evaluation_flags"] = state["evaluation_flags"]

        report["participation_status"] = (
            "Insufficient" if meaningful_ratio < 20 else "Sufficient"
        )

        report["insufficient_participation"] = False

        return report

    except Exception:

        return {
            "overall_score": 50,
            "communication": 5,
            "confidence": 5,
            "technical_reasoning": 5,
            "ownership": 5,
            "problem_solving": 5,
            "professionalism": 5,
            "strengths": [],
            "improvements": [],
            "summary": "Report generation failed.",
            "engagement_score": meaningful_ratio,
            "insufficient_participation": False,
            "meaningful_ratio": meaningful_ratio,
            "refusal_ratio": refusal_ratio,
            "total_candidate_messages": total_messages,
            "evaluation_flags": state["evaluation_flags"],
        }
