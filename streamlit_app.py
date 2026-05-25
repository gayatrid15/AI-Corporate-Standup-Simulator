import hashlib

import streamlit as st
from audio_recorder_streamlit import audio_recorder
from dotenv import load_dotenv

from graph.workflow import graph
from scenarios.loader import get_random_scenario
from voice.transcriber import transcribe_audio

load_dotenv()

st.set_page_config(page_title="AI Corporate Standup Simulator")

# ==========================================
# INITIALIZE SESSION STATE
# ==========================================

if "state" not in st.session_state:

    scenario = get_random_scenario()

    st.session_state.state = {
        # Conversation
        "messages": [],
        "candidate_claims": [],
        "contradictions": [],
        # Evaluation
        "evaluation_notes": [],
        "evaluation_flags": [],
        # Flow
        "conversation_started": False,
        "interview_complete": False,
        # Question Tracking
        "current_question_index": 0,
        "followup_count": 0,
        "current_followup_index": 0,
        # Scenario
        "scenario": scenario,
    }

# ==========================================
# AUDIO SESSION VARIABLES
# ==========================================

defaults = {
    "last_audio_hash": None,
    "recorder_key": 0,
    "processing_audio": False,
}

for key, value in defaults.items():

    if key not in st.session_state:
        st.session_state[key] = value

state = st.session_state.state

# ==========================================
# PAGE HEADER
# ==========================================

st.title("AI Corporate Standup Simulator")

# ==========================================
# SCENARIO INFO
# ==========================================

st.subheader("Scenario")

st.write(state["scenario"]["title"])

st.subheader("Candidate Brief")

st.write(state["scenario"]["candidate_context"])

# ==========================================
# INITIAL GREETING
# ==========================================

if not state["conversation_started"]:

    first_question = state["scenario"]["meeting_flow"][0]["question"]

    initial_message = "Good morning. Let's get started.\n\n" f"{first_question}"

    state["messages"].append(
        {
            "role": "assistant",
            "content": initial_message,
        }
    )

    state["conversation_started"] = True

# ==========================================
# CONVERSATION UI
# ==========================================

st.subheader("Conversation")

for msg in state["messages"]:

    if msg["role"] == "user":

        st.write(f"You: {msg['content']}")

    else:

        st.success(f"Manager: {msg['content']}")

# ==========================================
# INTERVIEW COMPLETE
# ==========================================

if state["interview_complete"]:

    st.success("Meeting Complete")

    st.stop()

# ==========================================
# AUDIO RECORDER
# ==========================================

st.subheader("Push To Talk")

audio_bytes = audio_recorder(
    pause_threshold=3.0,
    sample_rate=16000,
    key=f"recorder_{st.session_state.recorder_key}",
)

# ==========================================
# AUDIO PROCESSING
# ==========================================

if audio_bytes and not st.session_state.processing_audio:

    st.session_state.processing_audio = True

    try:

        # ==========================================
        # FILTER SMALL AUDIO
        # ==========================================

        if len(audio_bytes) < 5000:

            st.session_state.processing_audio = False

            st.stop()

        # ==========================================
        # AUDIO DEDUPLICATION
        # ==========================================

        current_audio_hash = hashlib.md5(audio_bytes).hexdigest()

        if current_audio_hash == st.session_state.last_audio_hash:

            st.session_state.processing_audio = False

            st.stop()

        st.session_state.last_audio_hash = current_audio_hash

        # ==========================================
        # SAVE AUDIO
        # ==========================================

        with open("temp_audio.webm", "wb") as f:

            f.write(audio_bytes)

        # ==========================================
        # TRANSCRIBE
        # ==========================================

        user_input = transcribe_audio("temp_audio.webm")

        user_input = user_input.strip() if user_input else ""

        # ==========================================
        # INVALID TRANSCRIPT
        # ==========================================

        if not user_input:

            st.warning("Incomplete or unclear speech detected. " "Please try again.")

            st.session_state.processing_audio = False

            st.stop()

        # ==========================================
        # SHOW TRANSCRIPT
        # ==========================================

        st.info(f"Transcript: {user_input}")

        # ==========================================
        # UPDATE STATE
        # ==========================================

        updated_input_state = {
            **state,
            "messages": [
                *state["messages"],
                {
                    "role": "user",
                    "content": user_input,
                },
            ],
            "candidate_claims": [
                *state["candidate_claims"],
                user_input,
            ],
        }

        # ==========================================
        # RUN WORKFLOW
        # ==========================================

        updated_state = graph.invoke(updated_input_state)

        # ==========================================
        # SAVE UPDATED STATE
        # ==========================================

        st.session_state.state = updated_state

        # ==========================================
        # RESET AUDIO STATE
        # ==========================================

        st.session_state.processing_audio = False

        st.session_state.recorder_key += 1

        st.session_state.last_audio_hash = None

        # ==========================================
        # RERENDER
        # ==========================================

        st.rerun()

    except Exception as e:

        st.session_state.processing_audio = False

        st.error(f"Error processing audio: {str(e)}")

# ==========================================
# EVALUATION NOTES
# ==========================================

st.subheader("Evaluation Notes")

notes = state.get("evaluation_notes", [])

if not notes:

    st.write("No evaluation notes yet.")

else:

    for note in notes:

        st.write(f"- {note}")
