from dotenv import load_dotenv

load_dotenv()

from scenarios.loader import get_random_scenario
from graph.workflow import graph

from voice.recorder import record_audio
from voice.transcriber import transcribe_audio
from voice.speaker import speak_text

scenario = get_random_scenario()


state = {
    "messages": [],
    "candidate_claims": [],
    "contradictions": [],
    "current_topic": "daily standup",
    "evaluation_notes": [],
    "evaluation_flags": [],
    "interview_complete": False,
    "scenario": scenario,
}


print("\n=== AI Standup Simulator ===\n")

print("\n=== Scenario ===")
print(scenario["title"])

print("\n=== Candidate Brief ===")
print(scenario["candidate_context"])


while True:

    print("\nStarting recording...")

    audio_path = record_audio()

    if not audio_path:
        continue

    user_input = transcribe_audio(audio_path)

    print(f"\nYou: {user_input}")

    clean_input = user_input.lower().strip()

    if not clean_input:
        continue

    if clean_input in ["exit", "quit", "stop"]:
        break

    state["messages"].append({"role": "user", "content": user_input})

    state["candidate_claims"].append(user_input)

    # Run LangGraph workflow
    state = graph.invoke(state)

    latest_message = state["messages"][-1]["content"]

    print(f"\nManager: {latest_message}\n")

    # Speak manager response
    speak_text(latest_message)


print("\n=== Evaluation Notes ===")

if len(state["evaluation_notes"]) == 0:

    print("No major observations recorded.")

else:

    for note in state["evaluation_notes"]:
        print("-", note)
