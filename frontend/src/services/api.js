const API_BASE = "http://127.0.0.1:8000";

export async function startSimulation(sessionId) {
  const response = await fetch(`${API_BASE}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

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

export function getReportUrl(sessionId) {
  return `http://127.0.0.1:8000/report/${sessionId}`;
}

export async function createSession(data) {
  const response = await fetch(`${API_BASE}/create-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  return await response.json();
}

export async function validateSession(data) {
  const response = await fetch(`${API_BASE}/validate-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to validate session");
  }

  return await response.json();
}

export async function getSessions(userId) {
  const response = await fetch(`${API_BASE}/sessions/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to load sessions");
  }

  return await response.json();
}

export async function endSession(sessionId) {
  const response = await fetch(`${API_BASE}/end-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to end session");
  }

  return await response.json();
}
