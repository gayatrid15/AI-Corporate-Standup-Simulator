import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSession, getSessions } from "../services/api";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHome from "../components/dashboard/DashboardHome";
import SessionsPage from "../components/dashboard/SessionsPage";
import ProfilePage from "../components/dashboard/ProfilePage";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("dashboard");

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

    if (!form.candidate_name.trim()) {
      alert("Candidate name is required");
      return;
    }

    if (!form.candidate_email.trim()) {
      alert("Candidate email is required");
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

      await loadSessions();

      setActiveTab("dashboard");

      alert("Interview session created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create interview session");
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
      className="d-flex min-vh-100 position-relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(0,229,255,0.10), transparent 25%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 30%),
          linear-gradient(to bottom, #020617, #050816, #030712)
        `,
      }}
    >
      {/* Glow Top Left */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "500px",
          height: "500px",
          top: "-200px",
          left: "-150px",
          background: "rgba(0,229,255,0.08)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* Glow Bottom Right */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-200px",
          right: "-150px",
          background: "rgba(59,130,246,0.10)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="position-relative d-flex w-100"
        style={{
          zIndex: 2,
        }}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
        />

        <div
          className="flex-grow-1 p-4"
          style={{
            overflowY: "auto",
            color: "#e2e8f0",
          }}
        >
          {activeTab === "dashboard" && (
            <DashboardHome sessions={sessions} copyLink={copyLink} />
          )}

          {activeTab === "sessions" && (
            <SessionsPage
              form={form}
              setForm={setForm}
              handleCreate={handleCreate}
            />
          )}

          {activeTab === "profile" && (
            <ProfilePage user={user} logout={logout} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
