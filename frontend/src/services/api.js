const API_BASE = "http://127.0.0.1:8000";

export async function sendMessage(message) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Backend connection failed");
  }

  return await response.json();
}
