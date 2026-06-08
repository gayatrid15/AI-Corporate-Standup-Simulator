import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ReportPage() {
  const { sessionId } = useParams();

  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/report-data/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("REPORT DATA:", data);
        setReport(data);
      })
      .catch(console.error);
  }, [sessionId]);

  if (!report) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center text-light"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 25%),
            radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 30%),
            linear-gradient(to bottom, #020617, #050816, #030712)
          `,
        }}
      >
        Loading Report...
      </div>
    );
  }

  if (report.error) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center text-light"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 25%),
            radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 30%),
            linear-gradient(to bottom, #020617, #050816, #030712)
          `,
        }}
      >
        <h3>{report.error}</h3>
      </div>
    );
  }

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
      {/* Top Glow */}
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

      {/* Bottom Glow */}
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

      <div
        className="position-relative"
        style={{
          width: "100%",
          maxWidth: "900px",
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
            Evaluation Report
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Performance assessment generated from the simulation.
          </p>
        </div>

        {/* Report Card */}
        <div
          className="p-4 p-md-5"
          style={{
            background: `
              radial-gradient(circle at top left, rgba(0,229,255,0.08), transparent 35%),
              rgba(5,10,20,0.92)
            `,
            border: "1px solid rgba(0,229,255,0.15)",
            borderRadius: "24px",
            backdropFilter: "blur(16px)",
            boxShadow: `
              0 0 25px rgba(0,229,255,0.08),
              0 10px 40px rgba(0,0,0,0.6)
            `,
          }}
        >
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <h5 style={{ color: "#7dd3fc" }}>Overall Score</h5>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#f0f9ff",
                }}
              >
                {report.overall_score}/100
              </div>
            </div>

            <div className="col-md-8">
              <div className="row">
                <div className="col-6 col-md-4 mb-3">
                  <strong style={{ color: "#7dd3fc" }}>Communication</strong>
                  <div className="text-light">{report.communication}/10</div>
                </div>

                <div className="col-6 col-md-4 mb-3">
                  <strong style={{ color: "#7dd3fc" }}>Confidence</strong>
                  <div className="text-light">{report.confidence}/10</div>
                </div>

                <div className="col-6 col-md-4 mb-3">
                  <strong style={{ color: "#7dd3fc" }}>Technical</strong>
                  <div className="text-light">
                    {report.technical_reasoning}/10
                  </div>
                </div>

                <div className="col-6 col-md-4">
                  <strong style={{ color: "#7dd3fc" }}>Ownership</strong>
                  <div className="text-light">{report.ownership}/10</div>
                </div>

                <div className="col-6 col-md-4">
                  <strong style={{ color: "#7dd3fc" }}>Problem Solving</strong>
                  <div className="text-light">{report.problem_solving}/10</div>
                </div>

                <div className="col-6 col-md-4">
                  <strong style={{ color: "#7dd3fc" }}>Professionalism</strong>
                  <div className="text-light">{report.professionalism}/10</div>
                </div>
              </div>
            </div>
          </div>

          <hr
            style={{
              borderColor: "rgba(125,211,252,0.15)",
            }}
          />

          <div className="row mt-4">
            <div className="col-md-6">
              <h4 className="mb-3" style={{ color: "#7dd3fc" }}>
                Strengths
              </h4>

              <ul className="text-light">
                {(report.strengths || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="col-md-6">
              <h4 className="mb-3" style={{ color: "#7dd3fc" }}>
                Areas for Improvement
              </h4>

              <ul className="text-light">
                {(report.improvements || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <hr
            style={{
              borderColor: "rgba(125,211,252,0.15)",
            }}
          />

          <h4 className="mb-3" style={{ color: "#7dd3fc" }}>
            Summary
          </h4>

          <p
            style={{
              color: "#e2e8f0",
              lineHeight: "1.8",
            }}
          >
            {report.summary}
          </p>

          <div className="mt-4">
            <a
              href={`http://127.0.0.1:8000/report/${sessionId}`}
              target="_blank"
              rel="noreferrer"
              className="btn text-light"
              style={{
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.18)",
                boxShadow: "0 0 10px rgba(0,229,255,0.06)",
              }}
            >
              Download PDF Report
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
