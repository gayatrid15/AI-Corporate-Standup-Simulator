import { useState } from "react";
import { Mic, SendHorizontal, X } from "lucide-react";

function MessageInput({ onSendMessage }) {
  const [input, setInput] = useState("");

  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    onSendMessage(input);

    setInput("");
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div
      className="p-3 position-relative overflow-hidden"
      style={{
        background: "rgba(2,6,23,0.72)",
        backdropFilter: "blur(20px)",

        boxShadow: `
          0 -10px 40px rgba(0,0,0,0.45),
          0 0 30px rgba(0,229,255,0.04)
        `,
      }}
    >
      {/* Ambient glow */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "220px",
          height: "220px",

          top: "-120px",
          left: "10%",

          background: "rgba(0,229,255,0.08)",

          filter: "blur(80px)",

          pointerEvents: "none",
        }}
      />

      {/* NORMAL MODE */}
      {!isListening ? (
        <div
          className="d-flex gap-3 align-items-center position-relative"
          style={{
            zIndex: 2,
          }}
        >
          {/* Input */}
          <div
            className="flex-grow-1 rounded-4 px-2 py-1"
            style={{
              background: `
                radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 35%),
                rgba(15,23,42,0.92)
              `,

              border: "1px solid rgba(0,229,255,0.14)",

              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.03),
                0 0 20px rgba(0,229,255,0.05)
              `,

              backdropFilter: "blur(12px)",
            }}
          >
            <textarea
              rows={1}
              className="form-control border-0 bg-transparent text-light shadow-none"
              placeholder="Type your response..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                color: "#e0f2fe",

                minHeight: "20px",
                maxHeight: "120px",

                paddingTop: "4px",
                paddingBottom: "4px",

                lineHeight: "1.4",

                overflowY: "auto",

                resize: "none",

                boxShadow: "none",
              }}
            />
          </div>

          {/* Send */}
          <button
            className="btn rounded-pill px-4 text-light fw-semibold"
            onClick={handleSend}
            style={{
              background: `
                linear-gradient(
                  135deg,
                  rgba(0,229,255,0.22),
                  rgba(59,130,246,0.22)
                )
              `,

              border: "1px solid rgba(0,229,255,0.18)",

              boxShadow: `
                0 0 20px rgba(0,229,255,0.10),
                inset 0 1px 1px rgba(255,255,255,0.04)
              `,

              backdropFilter: "blur(10px)",
            }}
          >
            <SendHorizontal size={18} />
          </button>

          {/* Mic */}
          <button
            className="btn rounded-circle text-light d-flex align-items-center justify-content-center"
            onClick={toggleListening}
            style={{
              width: "52px",
              height: "52px",

              background: "rgba(15,23,42,0.95)",

              border: "1px solid rgba(0,229,255,0.14)",

              boxShadow: "0 0 20px rgba(0,229,255,0.08)",

              transition: "0.3s",
            }}
          >
            <Mic size={22} strokeWidth={2} />
          </button>
        </div>
      ) : (
        /* VOICE MODE */
        <div
          className="position-relative d-flex flex-column align-items-center justify-content-center"
          style={{
            minHeight: "180px",
            zIndex: 2,
          }}
        >
          {/* floating close button */}
          <button
            className="btn position-absolute text-light d-flex align-items-center justify-content-center"
            onClick={toggleListening}
            style={{
              top: "0px",
              right: "0px",

              width: "42px",
              height: "42px",

              borderRadius: "50%",

              background: `
                  linear-gradient(
                    145deg,
                    rgba(20,30,48,0.92),
                    rgba(10,15,28,0.96)
                  )
                `,

              border: "1px solid rgba(125,211,252,0.12)",

              boxShadow: `
                  0 10px 25px rgba(0,0,0,0.35),
                  inset 0 1px 1px rgba(255,255,255,0.03)
                `,

              backdropFilter: "blur(10px)",

              zIndex: 10,
            }}
          >
            <X size={18} />
          </button>

          {/* OUTER ORB */}
          <div className="liquid-orb">
            {/* animated blobs */}
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="blob blob3"></div>

            {/* center glow */}
            <div className="core-glow"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageInput;
