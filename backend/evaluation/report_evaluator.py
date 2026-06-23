from typing import List

from pydantic import BaseModel, Field
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.1,
)


class AnswerEvaluation(BaseModel):
    question: str = ""
    answer: str = ""
    score: int = Field(
        default=0,
        ge=0,
        le=10,
    )
    feedback: str = ""


class InterviewReport(BaseModel):
    overall_score: int = Field(
        default=0,
        ge=0,
        le=100,
    )

    communication: int = Field(
        default=0,
        ge=0,
        le=10,
    )

    confidence: int = Field(
        default=0,
        ge=0,
        le=10,
    )

    technical_reasoning: int = Field(
        default=0,
        ge=0,
        le=10,
    )

    ownership: int = Field(
        default=0,
        ge=0,
        le=10,
    )

    problem_solving: int = Field(
        default=0,
        ge=0,
        le=10,
    )

    professionalism: int = Field(
        default=0,
        ge=0,
        le=10,
    )

    participation_status: str = ""

    strengths: List[str] = Field(default_factory=list)

    improvements: List[str] = Field(default_factory=list)

    summary: str = ""

    answer_evaluations: List[AnswerEvaluation] = Field(default_factory=list)


structured_llm = llm.with_structured_output(InterviewReport)


def generate_report(state):

    candidate_turns = []

    messages = state["messages"]

    for i in range(len(messages) - 1):

        if messages[i]["role"] == "assistant" and messages[i + 1]["role"] == "user":
            candidate_turns.append(
                {
                    "question": messages[i]["content"],
                    "answer": messages[i + 1]["content"],
                }
            )

    transcript = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])

    prompt = f"""
You are a strict senior corporate interviewer.

Candidate Role:
{state["candidate_role"]}

Evaluation Notes:
{state["evaluation_notes"]}

Evaluation Flags:
{state["evaluation_flags"]}

Transcript:
{transcript}

Question Answer Pairs:
{candidate_turns}

Evaluate the candidate exactly as a real interviewer.

Consider:

- technical knowledge
- communication
- confidence
- ownership
- problem solving
- professionalism
- participation
- answer quality
- depth of reasoning
- consistency

For each answer:

- assign a score from 0 to 10
- explain why the score was assigned
- mention missing points

Evaluate answers based on:

- correctness
- depth
- reasoning
- ownership
- clarity
- completeness

Score strictly.
Ignore any background disturbances and sounds.

If the interview was force-ended and contains limited information,
still provide the best possible evaluation based on the available answers.
"""

    try:

        report = structured_llm.invoke(prompt)

        report_dict = report.model_dump()

        report_dict["evaluation_flags"] = state["evaluation_flags"]

        return report_dict

    except Exception as e:

        print("REPORT GENERATION ERROR:")
        print(repr(e))

        return {
            "overall_score": 50,
            "communication": 5,
            "confidence": 5,
            "technical_reasoning": 5,
            "ownership": 5,
            "problem_solving": 5,
            "professionalism": 5,
            "participation_status": "Unknown",
            "strengths": [],
            "improvements": [],
            "summary": (f"Report generation failed: {str(e)}"),
            "evaluation_flags": state["evaluation_flags"],
            "answer_evaluations": [],
        }
