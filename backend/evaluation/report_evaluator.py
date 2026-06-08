import json

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.2,
)


def generate_report(state):

    transcript = "\n".join(
        [f"{msg['role']}: {msg['content']}" for msg in state["messages"]]
    )

    prompt = f"""
You are a professional corporate interview evaluator.

Evaluate the candidate based on:

1. Communication
2. Confidence of response
3. Technical reasoning
4. Ownership
5. Problem solving
6. Professionalism

Role:
{state["candidate_role"]}

Transcript:
{transcript}

Evaluation Notes:
{state["evaluation_notes"]}

Evaluation Flags:
{state["evaluation_flags"]}

Return ONLY valid JSON.

{{
  "overall_score": 85,
  "communication": 8,
  "confidence": 8,
  "technical_reasoning": 9,
  "ownership": 8,
  "problem_solving": 8,
  "professionalism": 9,
  "strengths": [
      "..."
  ],
  "improvements": [
      "..."
  ],
  "summary": "..."
}}
"""

    response = llm.invoke([SystemMessage(content=prompt)])

    try:
        return json.loads(response.content)
    except Exception:

        return {
            "overall_score": 70,
            "communication": 7,
            "confidence": 7,
            "technical_reasoning": 7,
            "ownership": 7,
            "problem_solving": 7,
            "professionalism": 7,
            "strengths": [],
            "improvements": [],
            "summary": "Report generation failed.",
        }
