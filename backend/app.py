from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.simulation_service import process_message

app = FastAPI()

# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# REQUEST MODEL
# ==========================================

class ChatRequest(BaseModel):
    message: str


# ==========================================
# CHAT ENDPOINT
# ==========================================

@app.post("/chat")
async def chat(req: ChatRequest):

    result = process_message(req.message)

    return result