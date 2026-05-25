# AI Corporate Communication & Standup Simulator

An AI-powered enterprise meeting simulation platform designed for:

- candidate assessment
- communication training
- engineering interview simulation
- incident handling evaluation
- corporate behavior analysis

The platform simulates realistic workplace interactions such as:

- standups
- client escalation calls
- production incidents
- architecture reviews
- requirement clarification meetings

using workflow orchestration, voice AI, and LLM-powered agents.

## Features

- Voice-based AI interaction
- Structured enterprise scenarios
- LangGraph workflow orchestration
- Evaluation-aware followups
- Stateful meeting memory
- Realistic manager AI behavior
- Deterministic meeting progression
- Multi-scenario simulations

## Architecture

User Voice
↓
Streamlit Push-To-Talk Recorder
↓
Speech-to-Text
↓
LangGraph Workflow Engine
↓
Evaluator Engine
↓
Decision Logic
↓
Manager Agent
↓
Conversation UI

## Tech Stack

| Component       | Technology       |
| --------------- | ---------------- |
| LLM             | Groq + Llama 3.1 |
| Workflow Engine | LangGraph        |
| Frontend        | Streamlit        |
| STT             | ElevenLabs       |
| TTS             | ElevenLabs       |
| Language        | Python           |

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/Corporate_simulator.git

cd Corporate_simulator
```

Create Virtual Environment
python -m venv vvenv
Activate Environment

Windows:

vvenv\Scripts\activate
Install Requirements
pip install -r requirements.txt
Configure Environment Variables

Create .env:

GROQ_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
Run Application
streamlit run streamlit_app.py

---

# `requirements.txt`

Generate automatically:

Inside activated venv:

```bash id="zqsn1k"
pip freeze > requirements.txt

Then clean unnecessary packages later if needed.
```
