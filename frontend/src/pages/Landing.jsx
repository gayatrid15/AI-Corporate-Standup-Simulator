import UserForm from "../components/forms/UserForm";

function Landing() {
  return (
    <div
      className="
        min-vh-100
        d-flex
        justify-content-center
        align-items-center
        px-3
        position-relative
        overflow-hidden
      "
      style={{
        background: `
          radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 25%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 30%),
          linear-gradient(to bottom, #020617, #050816, #030712)
        `,
      }}
    >
      {/* Atmospheric top glow */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "550px",
          height: "550px",
          top: "-250px",
          left: "-180px",
          background: "rgba(0,229,255,0.08)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* Atmospheric bottom glow */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-250px",
          right: "-150px",
          background: "rgba(59,130,246,0.10)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="position-relative"
        style={{
          width: "100%",
          maxWidth: "440px",
          zIndex: 2,
        }}
      >
        {/* Heading */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold mb-3"
            style={{
              color: "#f0f9ff",
              fontSize: "3rem",
              letterSpacing: "-1px",
              textShadow: "0 0 30px rgba(0,229,255,0.08)",
            }}
          >
            AI Corporate Simulator
          </h1>

          <p
            className="mb-0"
            style={{
              color: "#94a3b8",
              fontSize: "1.05rem",
              lineHeight: "1.7",
            }}
          >
            Practice workplace communication with AI-powered managers.
          </p>
        </div>

        {/* Form */}
        <UserForm />
      </div>
    </div>
  );
}

export default Landing;
