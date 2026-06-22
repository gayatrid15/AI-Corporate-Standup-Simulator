from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator, EmailStr
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from memory.session_store import sessions
from database.session_repository import (
    create_session,
    validate_candidate,
    mark_session_started,
    get_candidate_role,
    get_sessions_by_user,
)
import shutil
import tempfile
import os

from services.voice_service import process_voice

from services.simulation_service import (
    process_message,
    start_simulation,
)
from database.user_repository import (
    create_user,
    get_user_by_email,
    get_user_by_username,
)

from services.password_service import (
    hash_password,
    verify_password,
)
from services.email_service import send_interview_email

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


class StartSimulationRequest(BaseModel):
    session_id: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


class CreateSessionRequest(BaseModel):
    candidate_name: str = Field(min_length=1)
    candidate_email: EmailStr
    candidate_role: str
    created_by_user_id: str


class ValidateSessionRequest(BaseModel):
    session_id: str
    candidate_name: str
    candidate_email: EmailStr


class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class EndSessionRequest(BaseModel):
    session_id: str


@app.post("/start")
async def start(req: StartSimulationRequest):

    role = get_candidate_role(
        req.session_id,
    )
    print("ROLE FROM DB:", repr(role))
    if not role:
        raise HTTPException(status_code=404, detail="Session not found")

    return start_simulation(
        session_id=req.session_id,
        candidate_role=role,
    )


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


@app.get("/report/{session_id}")
async def download_report(session_id: str):

    path = f"reports/generated/{session_id}.pdf"

    return FileResponse(
        path,
        media_type="application/pdf",
        filename=f"{session_id}.pdf",
    )


@app.get("/report-data/{session_id}")
async def report_data(session_id: str):

    print("REQUESTED:", session_id)

    print("AVAILABLE SESSIONS:")
    print(list(sessions.keys()))

    state = sessions.get(session_id)

    if not state:
        raise HTTPException(status_code=404, detail="Session not found")

    return state.get("final_report", {})


@app.post("/create-session")
async def create_candidate_session(
    req: CreateSessionRequest,
):
    session_id = create_session(
        candidate_name=req.candidate_name,
        candidate_email=req.candidate_email,
        candidate_role=req.candidate_role,
        created_by_user_id=req.created_by_user_id,
    )

    interview_link = f"http://localhost:5173/interview/{session_id}"

    send_interview_email(
        req.candidate_name,
        req.candidate_email,
        interview_link,
    )

    return {
        "session_id": session_id,
        "interview_link": interview_link,
    }


@app.post("/validate-session")
async def validate_session(
    req: ValidateSessionRequest,
):
    print("SESSION:", req.session_id)
    print("NAME:", req.candidate_name)
    print("EMAIL:", req.candidate_email)
    session = validate_candidate(
        session_id=req.session_id,
        candidate_name=req.candidate_name,
        candidate_email=req.candidate_email,
    )

    if not session:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    mark_session_started(req.session_id)

    return {
        "valid": True,
        "candidate_role": session["CandidateRole"],
    }


@app.post("/signup")
async def signup(
    req: SignupRequest,
):

    existing_email = get_user_by_email(
        req.email,
    )

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    existing_username = get_user_by_username(
        req.username,
    )

    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    password_hash = hash_password(
        req.password,
    )

    user_id = create_user(
        username=req.username,
        email=req.email,
        password_hash=password_hash,
        role="Admin",
    )

    return {
        "success": True,
        "user_id": user_id,
        "message": "User created successfully",
    }


@app.post("/login")
async def login(
    req: LoginRequest,
):

    user = get_user_by_email(
        req.email,
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    valid_password = verify_password(
        req.password,
        user["PasswordHash"],
    )

    if not valid_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "success": True,
        "user_id": str(user["UserId"]),
        "username": user["Username"],
        "email": user["Email"],
        "role": user["Role"],
    }


@app.get("/sessions/{user_id}")
async def get_sessions(user_id: str):

    return get_sessions_by_user(user_id)


@app.post("/end-session")
async def end_session(req: EndSessionRequest):

    from services.simulation_service import force_end_session

    return force_end_session(req.session_id)
