from dotenv import load_dotenv

load_dotenv()
from langchain_groq import ChatGroq
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
)

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.5,
)


def manager_response(
    state,
    user_input,
    question_to_ask,
    is_followup=False,
):

    system_prompt = f"""
    You are a professional engineering manager conducting
    a realistic corporate meeting simulation.

    Meeting Context:
    {state['scenario']['manager_context']}

    Rules:
    - Sound natural and professional
    - Be concise
    - Ask one question at a time
    - Briefly acknowledge responses
    - Avoid aggressive interrogation
    - Do not invent new topics
    - Maintain realistic pacing
    - Stay focused on the provided question

    Question To Ask:
    {question_to_ask}

    Followup Mode:
    {is_followup}
    """

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"""
            Candidate Response:
            {user_input}
            Ask the next question naturally.
            """),
    ]

    response = llm.invoke(messages)
    return response.content.strip()
