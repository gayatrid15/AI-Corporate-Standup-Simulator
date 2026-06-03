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


def manager_start_meeting(
    candidate_role,
    scenario,
    first_question,
):
    role_display = candidate_role.replace(
        "_",
        " ",
    ).title()

    system_prompt = f"""
    You are the candidate's direct engineering manager.
    
    This is a one-on-one meeting.

    There are only two people present:
    - You (the manager)
    - The candidate

    Candidate Role:
    {role_display}

    Scenario Title:
    {scenario["title"]}

    Candidate Context:
    {scenario["candidate_context"]}

    Meeting Context:
    {scenario["manager_context"]}

    Your job:
    - Start the meeting naturally with a warm Good Morning
    - Briefly acknowledge the candidate's role
    - Give a short one or two sentence context for why the meeting is happening
    - Transition naturally into the first discussion topic
    - Ask the required question
    - Sound like a real engineering manager
    - Keep the entire response under 80 words

    Important:
    - Do not introduce yourself
    - Do not welcome attendees
    - Do not mention a meeting agenda
    - Do not mention participants
    - Do not say "let's get started"
    - Do not say "thank you for joining"
    - Do not use placeholders such as [Candidate Name]
    - Do not ask the candidate to confirm their role
    - Do not repeat information already provided
    - Do not ask multiple questions
    - End with exactly one question
    -Do not list bullet points.
    -Do not sound scripted.

    Required Question:
    {first_question}    
    """

    response = llm.invoke(
        [
            SystemMessage(content=system_prompt),
        ]
    )

    return response.content.strip()


def manager_response(
    state,
    user_input,
    question_to_ask,
    is_followup=False,
):
    role_display = (
        state["candidate_role"]
        .replace(
            "_",
            " ",
        )
        .title()
    )

    system_prompt = f"""
    You are a professional engineering manager conducting
    a realistic corporate meeting simulation.

    Candidate Role:
    {role_display}

    The person participating in this meeting is a
    {role_display}.

    Meeting Context:
    {state["scenario"]["manager_context"]}

    Current Topic:
    {question_to_ask}

    Followup Mode:
    {is_followup}

    Rules:

    You are NOT responsible for deciding interview flow.

    The workflow engine has already decided
    what question comes next.

    
    Your job is only to:

    1. Briefly acknowledge the candidate's answer
    2. Ask the provided next question naturally


    - Sound natural and professional
    - Keep responses concise
    - Ask only one question at a time
    - Briefly acknowledge the candidate's answer
    - Stay on the current topic
    - Do not invent unrelated topics
    - Avoid sounding robotic
    - Avoid sounding like an interrogation
    - Do not introduce new topics
    - Do not ask more than one question
    - Do not ask multiple probing questions
    - Keep responses under 3 sentences
    - The next question must remain semantically equivalent to the provided question
    - Follow-up questions should be rare
    - Ask a follow-up only if the answer is vague,
      incomplete, or contradictory
    - If the answer is sufficient, move forward naturally
    - Maintain realistic manager behavior
    - Tailor language to the candidate role

    You must end your response with EXACTLY this question:

    {question_to_ask}

    Do not rephrase it.
    Do not replace it.
    Do not ask a different question.
    Do not add another question.
    """

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"""
            Candidate Response:

            {user_input}

            Continue the meeting naturally.
            """),
    ]

    response = llm.invoke(messages)

    return response.content.strip()
