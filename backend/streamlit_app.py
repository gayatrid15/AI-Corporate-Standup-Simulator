import hashlib
import time

import streamlit as st
from audio_recorder_streamlit import audio_recorder
from dotenv import load_dotenv

from graph.workflow import graph
from scenarios.loader import get_random_scenario
from voice.speaker import text_to_speech
from voice.transcriber import transcribe_audio

load_dotenv()

st.set_page_config(page_title="AI Corporate Standup Simulator")

# ==========================================
# SESSION STATE INIT
# ==========================================

if "state" not in st.session_state:

    scenario = get_random_scenario()

    st.session_state.state = {
        "messages": [],
        "candidate_claims": [],
        "contradictions": [],
        "evaluation_notes": [],
        "evaluation_flags": [],
        "conversation_started": False,
        "interview_complete": False,
        "current_question_index": 0,
        "followup_count": 0,
        "current_followup_index": 0,
        "scenario": scenario,
    }

# AUDIO CONTROL STATE
defaults = {
    "last_audio_hash": None,
    "recorder_key": 0,
    "processing_audio": False,
    "last_spoken_hash": None,
}

for k, v in defaults.items():
    if k not in st.session_state:
        st.session_state[k] = v

state = st.session_state.state

# ==========================================
# HEADER
# ==========================================

st.title("AI Corporate Standup Simulator")

st.subheader("Scenario")
st.write(state["scenario"]["title"])

st.subheader("Candidate Brief")
st.write(state["scenario"]["candidate_context"])

# ==========================================
# INIT FIRST MESSAGE
# ==========================================

if not state["conversation_started"]:

    q = state["scenario"]["meeting_flow"][0]["question"]

    state["messages"].append(
        {
            "role": "assistant",
            "content": f"Good morning. Let's get started.\n\n{q}",
        }
    )

    state["conversation_started"] = True

# ==========================================
# AUDIO INPUT
# ==========================================

st.subheader("Push To Talk")

audio_bytes = audio_recorder(
    pause_threshold=3.0,
    sample_rate=16000,
    key=f"recorder_{st.session_state.recorder_key}",
)

# ==========================================
# PROCESS INPUT ONLY (NO UI HERE)
# ==========================================

if audio_bytes and not st.session_state.processing_audio:

    st.session_state.processing_audio = True

    try:

        if len(audio_bytes) < 5000:
            st.session_state.processing_audio = False
            st.stop()

        audio_hash = hashlib.md5(audio_bytes).hexdigest()

        if audio_hash == st.session_state.last_audio_hash:
            st.session_state.processing_audio = False
            st.stop()

        st.session_state.last_audio_hash = audio_hash

        with open("temp_audio.webm", "wb") as f:
            f.write(audio_bytes)

        user_input = transcribe_audio("temp_audio.webm")
        user_input = user_input.strip() if user_input else ""

        if not user_input:
            st.warning("Could not understand audio")
            st.session_state.processing_audio = False
            st.stop()

        # ADD USER MESSAGE
        updated_input_state = {
            **state,
            "messages": [
                *state["messages"],
                {"role": "user", "content": user_input},
            ],
            "candidate_claims": [
                *state["candidate_claims"],
                user_input,
            ],
        }

        # RUN WORKFLOW
        updated_state = graph.invoke(updated_input_state)
        st.session_state.state = updated_state

        # TTS CONTROL (ONLY GENERATE, NOT BLOCK UI)
        last_msg = updated_state["messages"][-1]

        if last_msg["role"] == "assistant":

            text = last_msg["content"].strip()

            msg_hash = hashlib.md5(text.encode()).hexdigest()

            if msg_hash != st.session_state.last_spoken_hash:

                audio_file = text_to_speech(text)

                st.session_state.last_audio = audio_file
                st.session_state.last_spoken_hash = msg_hash

        st.session_state.processing_audio = False
        st.session_state.recorder_key += 1
        st.session_state.last_audio_hash = None

        st.rerun()

    except Exception as e:
        st.session_state.processing_audio = False
        st.error(str(e))

# ==========================================
# RENDER CONVERSATION (ALWAYS)
# ==========================================

st.subheader("Conversation")

for msg in state["messages"]:
    if msg["role"] == "user":
        st.write(f"You: {msg['content']}")
    else:
        st.success(f"Manager: {msg['content']}")

# PLAY AUDIO OUTSIDE FLOW (CRITICAL FIX)
if "last_audio" in st.session_state:
    st.audio(st.session_state.last_audio)

# ==========================================
# EVALUATION NOTES
# ==========================================

st.subheader("Evaluation Notes")

for note in state.get("evaluation_notes", []):
    st.write(f"- {note}")

# KEEP UI ALWAYS VISIBLE
st.subheader("Push To Talk Ready")
