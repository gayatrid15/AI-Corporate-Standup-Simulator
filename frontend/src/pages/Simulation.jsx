import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import VoiceOrb from "../components/assistant/VoiceOrb";

function Simulation() {
  const { sessionId } = useParams();

  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "manager",
      text: "Good morning. Give me your sprint update.",
    },
  ]);

  const handleSendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const managerReply = {
        id: Date.now() + 1,
        sender: "manager",
        text: "Understood. Any blockers?",
      };

      setMessages((prev) => [...prev, managerReply]);
    }, 1000);
  };

  const handleEndSession = () => {
    navigate("/");
  };

  return (
    <div
      className="
        vh-100
        d-flex
        flex-column
        text-light
        position-relative
        overflow-hidden
      "
      style={{
        background: `
          radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 25%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.12), transparent 30%),
          linear-gradient(to bottom, #020617, #050816, #030712)
        `,
      }}
    >
      {/* Background atmospheric glows */}

      <div
        className="position-absolute rounded-circle"
        style={{
          width: "500px",
          height: "500px",
          top: "-200px",
          left: "-150px",
          background: "rgba(0,229,255,0.08)",
          filter: "blur(120px)",
        }}
      />

      <div
        className="position-absolute rounded-circle"
        style={{
          width: "450px",
          height: "450px",
          bottom: "-200px",
          right: "-100px",
          background: "rgba(59,130,246,0.10)",
          filter: "blur(120px)",
        }}
      />

      {/* Header */}

      <div
        className="
          px-4
          py-3
          d-flex
          justify-content-between
          align-items-center
          position-relative
        "
        style={{
          background: "rgba(3,7,18,0.72)",
          backdropFilter: "blur(18px)",

          boxShadow: `
            0 10px 40px rgba(0,0,0,0.45),
            0 0 25px rgba(0,229,255,0.05)
          `,

          zIndex: 5,
        }}
      >
        <div>
          <h4
            className="mb-0 fw-semibold"
            style={{
              color: "#e0f2fe",
              letterSpacing: "0.5px",
            }}
          >
            Corporate Simulation
          </h4>

          <small
            style={{
              color: "#7dd3fc",
              opacity: 0.7,
            }}
          >
            Session: {sessionId}
          </small>
        </div>

        <button
          onClick={handleEndSession}
          className="session-btn d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={18} />

          <span className="session-text">End Session</span>
        </button>
      </div>

      {/* Chat area */}

      <div
        className="flex-grow-1 overflow-auto position-relative"
        style={{
          zIndex: 2,
        }}
      >
        <ChatWindow messages={messages} />
      </div>

      {/* Input */}

      <div
        style={{
          zIndex: 5,
        }}
      >
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Simulation;
