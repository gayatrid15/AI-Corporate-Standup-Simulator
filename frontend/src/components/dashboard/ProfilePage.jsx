function ProfilePage({ user, logout }) {
  return (
    <div
      className="p-4"
      style={{
        background: "rgba(5,10,20,0.92)",
        border: "1px solid rgba(0,229,255,0.15)",
        borderRadius: "20px",
        maxWidth: "600px",
      }}
    >
      <div className="text-center mb-4">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: "90px",
            height: "90px",
            background: "rgba(0,229,255,0.12)",
            color: "#7dd3fc",
            fontSize: "2rem",
            fontWeight: "700",
          }}
        >
          {user?.username?.charAt(0)?.toUpperCase()}
        </div>

        <h3 style={{ color: "#f0f9ff" }}>{user?.username}</h3>
      </div>

      <div className="mb-3">
        <strong style={{ color: "#7dd3fc" }}>Email</strong>

        <div style={{ color: "#e2e8f0" }}>{user?.email}</div>
      </div>

      <div className="mb-4">
        <strong style={{ color: "#7dd3fc" }}>Role</strong>

        <div style={{ color: "#e2e8f0" }}>{user?.role}</div>
      </div>

      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;
