from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from graph.workflow import graph
from scenarios.loader import get_random_scenario

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
# SESSION MEMORY
# ==========================================

conversation_state = {"scenario": get_random_scenario(), "messages": []}

# ==========================================
# REQUEST MODEL
# ==========================================


class ChatRequest(BaseModel):
    message: str


# ==========================================
# CHAT ENDPOINT
# ==========================================


@app.post("/chat")
async def chat(request: ChatRequest):

    user_message = request.message

    state = {
        "scenario": conversation_state["scenario"],
        "messages": conversation_state["messages"],
        "user_input": user_message,
    }

    result = graph.invoke(state)

    manager_reply = result.get("manager_reply", "")

    conversation_state["messages"].append({"role": "user", "content": user_message})

    conversation_state["messages"].append(
        {"role": "assistant", "content": manager_reply}
    )

    return {"reply": manager_reply, "evaluation": result.get("evaluation", "")}
