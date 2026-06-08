import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { startSimulation, sendMessage } from "../services/api";

import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import VoiceOrb from "../components/assistant/VoiceOrb";

function Simulation() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidateRole = location.state?.role;
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [candidateContext, setCandidateContext] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [report, setReport] = useState(null);

  // FIX: missing state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!candidateRole) {
      navigate("/");
      return;
    }

    async function init() {
      try {
        const data = await startSimulation(candidateRole);

        setSessionId(data.session_id);
        setScenarioTitle(data.scenario_title);
        setCandidateContext(data.candidate_context);

        setMessages([
          {
            sender: "manager",
            text: data.manager_message,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    }

    init();
  }, [candidateRole, navigate]);

  // existing logic unchanged
  const handleEndSession = () => {
    setSessionId("");
    navigate("/");
  };

  // FIX: missing function
  const handleCopySession = async () => {
    if (!sessionId) return;

    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (message) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
      },
    ]);

    try {
      const data = await sendMessage(sessionId, message);

      setMessages((prev) => [
        ...prev,
        {
          sender: "manager",
          text: data.manager_response,
        },
      ]);

      if (data.interview_complete && data.report) {
        setReport(data.report);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleVoiceMessage = (
    transcript,
    managerResponse,
    interviewComplete = false,
    reportData = null,
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: transcript,
      },
      {
        sender: "manager",
        text: managerResponse,
      },
    ]);
    if (interviewComplete && reportData) {
      setReport(reportData);
    }
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
          <div className="d-flex align-items-center gap-2">
            <h4
              className="mb-0 fw-semibold"
              style={{
                color: "#e0f2fe",
                letterSpacing: "0.5px",
              }}
            >
              Corporate Simulation
            </h4>

            {/* SESSION ID BADGE */}
            <div
              onClick={handleCopySession}
              title="Click to copy session id"
              style={{
                position: "relative",
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7dd3fc",
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.18)",
                boxShadow: "0 0 10px rgba(0,229,255,0.06)",
              }}
            >
              ⧉{/* Hover tooltip */}
              <div
                style={{
                  position: "absolute",
                  top: "32px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "10px",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "#0f172a",
                  border: "1px solid rgba(125,211,252,0.3)",
                  color: "#7dd3fc",
                  whiteSpace: "nowrap",
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "0.2s ease",
                }}
                className="session-tooltip"
              >
                {sessionId ? sessionId : "No session"}
              </div>
              {copied && (
                <div
                  style={{
                    position: "absolute",
                    top: "-26px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "9px",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "#0f172a",
                    border: "1px solid rgba(125,211,252,0.3)",
                    color: "#7dd3fc",
                    whiteSpace: "nowrap",
                  }}
                >
                  Copied
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleEndSession}
          className="session-btn d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={18} />
          <span className="session-text">End Session</span>
        </button>
      </div>

      {/* SCENARIO BOX */}
      <div
        className="px-3 py-3 rounded-1 position-relative text-center"
        style={{
          margin: "12px 16px",
          background: `  linear-gradient(135deg, rgba(56,189,248,0.10), rgba(59,130,246,0.05)),  rgba(2, 6, 23, 0.65)`,
          border: "1px solid rgba(56,189,248,0.18)",
          boxShadow: `
            0 12px 30px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.03)
          `,
          backdropFilter: "blur(28px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            color: "rgba(125,211,252,0.8)",
            marginBottom: "6px",
            textTransform: "uppercase",
          }}
        >
          Scenario Context
        </div>

        <h3
          style={{
            fontSize: "15px",
            color: "#e0f2fe",
            margin: 0,
            fontWeight: 600,
          }}
        >
          {scenarioTitle}
        </h3>

        <p
          style={{
            fontSize: "13px",
            color: "rgba(125,211,252,0.85)",
            marginTop: "8px",
            lineHeight: 1.5,
          }}
        >
          {candidateContext}
        </p>
      </div>

      {/* Chat */}
      <div className="flex-grow-1 overflow-auto position-relative">
        <ChatWindow messages={messages} />
      </div>

      {report && (
        <div
          style={{
            margin: "12px 16px",
            padding: "16px",
            background: "rgba(2,6,23,0.75)",
            border: "1px solid rgba(56,189,248,0.18)",
            borderRadius: "8px",
            backdropFilter: "blur(20px)",
            color: "#e0f2fe",
            zIndex: 5,
          }}
        >
          <h5 style={{ marginBottom: "12px" }}>Evaluation Report</h5>

          <p>
            <strong>Overall Score:</strong> {report.overall_score}/100
          </p>

          <p>
            <strong>Communication:</strong> {report.communication}/10
          </p>

          <p>
            <strong>Confidence:</strong> {report.confidence}/10
          </p>

          <p>
            <strong>Technical Reasoning:</strong> {report.technical_reasoning}
            /10
          </p>

          <p>
            <strong>Ownership:</strong> {report.ownership}/10
          </p>

          <p>
            <strong>Problem Solving:</strong> {report.problem_solving}/10
          </p>

          <p>
            <strong>Professionalism:</strong> {report.professionalism}/10
          </p>

          <p style={{ marginTop: "12px" }}>
            <strong>Summary:</strong>
            <br />
            {report.summary}
          </p>

          <a
            href={`http://127.0.0.1:8000/report/${sessionId}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#7dd3fc",
              textDecoration: "none",
            }}
          >
            Download PDF Report
          </a>
        </div>
      )}

      {/* Input */}
      <div style={{ zIndex: 5 }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          onVoiceMessage={handleVoiceMessage}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
}

export default Simulation;
