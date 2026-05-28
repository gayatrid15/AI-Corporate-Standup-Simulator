const API_BASE = "http://127.0.0.1:8000";

export async function startSimulation() {
  const response = await fetch(`${API_BASE}/start`);

  if (!response.ok) {
    throw new Error("Failed to start simulation");
  }

  return await response.json();
}

export async function sendMessage(sessionId, message) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Backend connection failed");
  }

  return await response.json();
}

export async function sendAudio(sessionId, audioBlob) {
  const formData = new FormData();

  formData.append("session_id", sessionId);
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch(`${API_BASE}/voice-chat`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Voice request failed");
  }

  return await response.json();
}
