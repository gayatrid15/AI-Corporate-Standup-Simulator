function MessageBubble({ sender, text, reportUrl }) {
  const isManager = sender === "manager";

  return (
    <div
      className={`d-flex mb-4 ${
        isManager ? "justify-content-start" : "justify-content-end"
      }`}
    >
      <div
        className="position-relative px-3 py-2 rounded-4 overflow-hidden"
        style={{
          maxWidth: "75%",
          width: "fit-content",
          minWidth: "80px",
          background: `
            radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 35%),
            radial-gradient(circle at bottom right, rgba(59,130,246,0.10), transparent 40%),
            rgba(5,10,20,0.92)
          `,
          border: "1px solid rgba(0,229,255,0.15)",
          boxShadow: `
            0 0 25px rgba(0,229,255,0.08),
            0 10px 40px rgba(0,0,0,0.6)
          `,
          backdropFilter: "blur(14px)",
        }}
      >
        {/* top left glow */}
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "120px",
            height: "120px",
            top: "-60px",
            left: "-60px",
            background: "rgba(0,229,255,0.12)",
            filter: "blur(35px)",
          }}
        />

        {/* bottom right glow */}
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "140px",
            height: "140px",
            bottom: "-80px",
            right: "-80px",
            background: "rgba(59,130,246,0.12)",
            filter: "blur(40px)",
          }}
        />

        {/* Animated ripple */}
        <div
          className="position-absolute"
          style={{
            inset: 0,
            overflow: "hidden",
            borderRadius: "inherit",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        >
          <div className="water-ripple" />
        </div>

        <div className="position-relative">
          <div
            className="small fw-semibold mb-1"
            style={{
              color: "#7dd3fc",
              opacity: 0.8,
            }}
          >
            {isManager ? "Manager" : "You"}
          </div>

          <div
            style={{
              color: "#e0f2fe",
              lineHeight: "1.5",
              fontSize: "15px",

              overflowWrap: "break-word",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            <>
              <div>{text}</div>

              {reportUrl && (
                <div style={{ marginTop: "10px" }}>
                  <a
                    href={reportUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#7dd3fc",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    👁 View Report
                  </a>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
