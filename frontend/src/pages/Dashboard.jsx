import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSession, getSessions } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [sessions, setSessions] = useState([]);

  const [form, setForm] = useState({
    candidate_name: "",
    candidate_email: "",
    candidate_role: "Backend Developer",
  });

  async function loadSessions() {
    try {
      const data = await getSessions(user.user_id);
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();

    if (!form.candidate_name.trim() || !form.candidate_email.trim()) {
      alert("Name and Email are required");
      return;
    }
    try {
      await createSession({
        ...form,
        created_by_user_id: user.user_id,
      });

      setForm({
        candidate_name: "",
        candidate_email: "",
        candidate_role: "Backend Developer",
      });

      loadSessions();
    } catch (err) {
      console.error(err);
    }
  }

  function copyLink(sessionId) {
    const url = `${window.location.origin}/interview/${sessionId}`;
    navigator.clipboard.writeText(url);
    alert("Interview link copied");
  }

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div
      className="min-vh-100 px-3 py-4 position-relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 25%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 30%),
          linear-gradient(to bottom, #020617, #050816, #030712)
        `,
        color: "#e2e8f0",
      }}
    >
      {/* Glow Effects */}
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
          width: "500px",
          height: "500px",
          bottom: "-200px",
          right: "-150px",
          background: "rgba(59,130,246,0.10)",
          filter: "blur(120px)",
        }}
      />

      <div className="position-relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1
              style={{
                color: "#f0f9ff",
                fontWeight: "700",
                letterSpacing: "-1px",
              }}
            >
              Dashboard
            </h1>
            <p style={{ color: "#94a3b8" }}>Welcome, {user?.username}</p>
          </div>

          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>

        {/* Create Session Card */}
        <div
          className="p-4 mb-4"
          style={{
            background: "rgba(5,10,20,0.92)",
            border: "1px solid rgba(0,229,255,0.15)",
            borderRadius: "20px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 25px rgba(0,229,255,0.06)",
          }}
        >
          <h4 style={{ color: "#7dd3fc" }} className="mb-3">
            Create Interview
          </h4>

          <form onSubmit={handleCreate}>
            <input
              className="form-control mb-3"
              placeholder="Candidate Name"
              value={form.candidate_name}
              onChange={(e) =>
                setForm({ ...form, candidate_name: e.target.value })
              }
              style={inputStyle}
            />

            <input
              className="form-control mb-3"
              placeholder="Candidate Email"
              value={form.candidate_email}
              onChange={(e) =>
                setForm({ ...form, candidate_email: e.target.value })
              }
              style={inputStyle}
            />

            <select
              className="form-select mb-3"
              value={form.candidate_role}
              onChange={(e) =>
                setForm({ ...form, candidate_role: e.target.value })
              }
              style={inputStyle}
            >
              <option>Backend Developer</option>
              <option>Frontend Developer</option>
              <option>Data Scientist</option>
              <option>DevOps Engineer</option>
            </select>

            <button className="btn btn-primary">Generate Session</button>
          </form>
        </div>

        {/* Sessions Table */}
        <div
          className="p-4"
          style={{
            background: "rgba(5,10,20,0.92)",
            border: "1px solid rgba(0,229,255,0.15)",
            borderRadius: "20px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 25px rgba(0,229,255,0.06)",
          }}
        >
          <h4 style={{ color: "#7dd3fc" }} className="mb-3">
            Interview Sessions
          </h4>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr style={{ color: "#7dd3fc" }}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Link</th>
                  <th>Report</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr key={session.SessionId}>
                    <td>{session.CandidateName}</td>
                    <td>{session.CandidateEmail}</td>
                    <td>{session.CandidateRole}</td>
                    <td>{session.Status}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => copyLink(session.SessionId)}
                      >
                        Copy
                      </button>
                    </td>

                    <td>
                      {session.Status === "Completed" && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            window.open(
                              `/report/${session.SessionId}`,
                              "_blank",
                            )
                          }
                        >
                          Open
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background: "rgba(15,23,42,0.88)",
  border: "1px solid rgba(0,229,255,0.15)",
  color: "#e2e8f0",
  padding: "12px",
  borderRadius: "12px",
};

export default Dashboard;
