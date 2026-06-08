import { Eye } from "lucide-react";

function ReportCard({ sessionId }) {
  return (
    <div
      className="px-3 py-3 rounded-1 position-relative text-center"
      style={{
        margin: "12px 16px",
        background: `
          linear-gradient(
            135deg,
            rgba(56,189,248,0.10),
            rgba(59,130,246,0.05)
          ),
          rgba(2,6,23,0.65)
        `,
        border: "1px solid rgba(56,189,248,0.18)",
        boxShadow: `
          0 12px 30px rgba(0,0,0,0.45),
          inset 0 1px 0 rgba(255,255,255,0.03)
        `,
        backdropFilter: "blur(28px)",
      }}
    >
      <a
        href={`/report/${sessionId}`}
        target="_blank"
        rel="noreferrer"
        className="
          text-decoration-none
          d-inline-flex
          align-items-center
          gap-2
        "
        style={{
          color: "#7dd3fc",
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        <Eye size={18} />
        View Report
      </a>
    </div>
  );
}

export default ReportCard;
