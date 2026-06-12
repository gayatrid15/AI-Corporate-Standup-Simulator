import UserForm from "../components/forms/UserForm";
import WaveBackground from "../components/forms/WaveBackground";
import logo from "../assets/logo4.png";

function Landing() {
  return (
    <div
      className="
        min-vh-100
        d-flex
        align-items-center
        px-4
        position-relative
        
      "
      style={{
        background: `
          radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 25%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 30%),
          linear-gradient(to bottom, #020617, #050816, #030712)
        `,
      }}
    >
      <WaveBackground />
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          overflow: "hidden",
          zIndex: 0,
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
          }}
        />
      </div>

      {/* Content */}
      {/* Content */}
      <div
        className="container position-relative"
        style={{
          zIndex: 2,
        }}
      >
        <div className="row align-items-center">
          {/* Left Side */}
          <div className="col-lg-6 mb-5 mb-lg-0 align-items-center">
            <div style={{ maxWidth: "550px" }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={logo}
                  alt="Corporate Simulator Logo"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />

                <h1
                  className="fw-bold mb-0"
                  style={{
                    color: "#bfcdd6",
                    fontSize: "3.5rem",
                    letterSpacing: "-2px",
                    textShadow: "0 0 30px rgba(0,229,255,0.08)",
                  }}
                >
                  Arieo | Lexus
                </h1>
              </div>

              {/* <p
                style={{
                  color: "#94a3b8",
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  maxWidth: "500px",
                }}
              >
                Practice workplace communication with AI-powered managers,
                handle realistic corporate scenarios, and receive instant
                feedback to improve your professional communication skills.
              </p> */}

              <div
                className="mt-4"
                style={{
                  color: "#cbd5e1",
                  fontSize: "1rem",
                  lineHeight: "2",
                }}
              >
                <div>✓ Realistic manager conversations</div>
                <div>✓ AI-powered evaluation</div>
                <div>✓ Workplace communication training</div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-lg-6 d-flex justify-content-center">
            <div
              style={{
                width: "100%",
                maxWidth: "440px",
              }}
            >
              <UserForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
