import { useState } from "react";
import { Mic, SendHorizontal, X } from "lucide-react";
import VoiceOrb from "../assistant/VoiceOrb";

function MessageInput({ onSendMessage, onVoiceMessage, sessionId }) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleSend = () => {
    if (!input.trim()) return;

    onSendMessage(input);
    setInput("");
  };

  const startListening = async () => {
    try {
      setTranscript("");
      setIsListening(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const recorder = new MediaRecorder(stream);

      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, {
            type: "audio/webm",
          });

          const formData = new FormData();

          formData.append("session_id", sessionId);
          formData.append("audio", audioBlob, "recording.webm");

          const response = await fetch("http://127.0.0.1:8000/voice-chat", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          console.log("VOICE RESPONSE:", data);

          if (data.audio_path) {
            const audioFile = data.audio_path.split(/[\\/]/).pop();

            const audioUrl = `http://127.0.0.1:8000/audio/${audioFile}`;

            console.log("AUDIO URL:", audioUrl);

            const audio = new Audio(audioUrl);

            audio.oncanplaythrough = () => {
              console.log("Audio ready");
            };

            audio.onplay = () => {
              console.log("Audio started");
            };

            audio.onerror = (e) => {
              console.error("Audio error:", e);
            };

            audio
              .play()
              .then(() => {
                console.log("Playback success");
              })
              .catch((err) => {
                console.error("Playback failed:", err);
              });
          }

          if (data.transcript) {
            setTranscript(data.transcript);

            onVoiceMessage(data.transcript, data.manager_response);
          } else {
            setTranscript("No speech detected");
          }
        } catch (error) {
          console.error("Voice upload failed:", error);
          setTranscript("Voice processing failed");
        }
      };

      recorder.start();

      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Mic access error:", error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);

    if (mediaRecorder) {
      mediaRecorder.stop();
    }
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
      {/* ambient glow */}
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
      {!isVoiceMode ? (
        <div
          className="d-flex gap-3 align-items-center position-relative"
          style={{ zIndex: 2 }}
        >
          {/* input */}
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

          {/* send */}
          <button
            className="btn rounded-pill px-4 text-light fw-semibold"
            onClick={handleSend}
          >
            <SendHorizontal size={18} />
          </button>

          {/* mic */}
          <button
            className="btn rounded-circle text-light d-flex align-items-center justify-content-center"
            onClick={() => setIsVoiceMode(true)}
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
          style={{ minHeight: "220px", zIndex: 2 }}
        >
          {/* close */}
          <button
            className="btn position-absolute text-light d-flex align-items-center justify-content-center"
            onClick={() => {
              stopListening();
              setTranscript("");
              setIsVoiceMode(false);
            }}
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

          <VoiceOrb
            isListening={isListening}
            isSpeaking={false}
            onStart={startListening}
            onStop={stopListening}
          />

          <div
            className="mt-4 text-info text-center"
            style={{
              letterSpacing: "1px",
              fontSize: "13px",
              opacity: 0.85,
              maxWidth: "80%",
              wordWrap: "break-word",
            }}
          >
            {!isListening && transcript === "" && "Press to speak"}
            {isListening && transcript === "" && "Listening..."}
            {transcript !== "" && transcript}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageInput;
