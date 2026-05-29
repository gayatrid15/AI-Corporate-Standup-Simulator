from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import shutil
import tempfile
import os

from services.voice_service import process_voice

from services.simulation_service import (
    process_message,
    start_simulation,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("generated_audio", exist_ok=True)

app.mount(
    "/audio",
    StaticFiles(directory="generated_audio"),
    name="audio",
)


class ChatRequest(BaseModel):
    session_id: str
    message: str


@app.get("/start")
async def start():
    return start_simulation()


@app.post("/chat")
async def chat(req: ChatRequest):

    return process_message(
        req.session_id,
        req.message,
    )


@app.post("/voice-chat")
async def voice_chat(
    session_id: str = Form(...),
    audio: UploadFile = File(...),
):

    audio_bytes = await audio.read()

    return await process_voice(
        session_id,
        audio_bytes,
    )
