import { LayoutDashboard, FolderPlus, User } from "lucide-react";
import logo4 from "../../assets/logo4.png";

function Sidebar({ activeTab, setActiveTab, user }) {
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "sessions",
      label: "Sessions",
      icon: FolderPlus,
    },
    {
      key: "profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div
      className="d-flex flex-column p-4"
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "rgba(5,10,20,0.95)",
        borderRight: "1px solid rgba(0,229,255,0.15)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="d-flex align-items-center gap-3 mb-5">
        <img
          src={logo4}
          alt="Arieo Lexus"
          style={{
            width: "30px",
            height: "30px",
            objectFit: "contain",
            filter: "drop-shadow(0 0 10px rgba(0,229,255,0.25))",
          }}
        />

        <h3
          style={{
            color: "#7dd3fc",
            fontWeight: "700",
            margin: 0,
            fontSize: "1.5rem",
          }}
        >
          Arieo | Lexus
        </h3>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className="btn text-start d-flex align-items-center gap-3 mb-2"
            style={{
              background:
                activeTab === item.key ? "rgba(0,229,255,0.12)" : "transparent",
              border:
                activeTab === item.key
                  ? "1px solid rgba(0,229,255,0.2)"
                  : "1px solid transparent",
              color: activeTab === item.key ? "#7dd3fc" : "#cbd5e1",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}

      <div className="mt-auto">
        <div
          className="d-flex align-items-center gap-3 p-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              background: "rgba(0,229,255,0.12)",
              color: "#7dd3fc",
              fontWeight: "700",
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <div style={{ color: "#e2e8f0" }}>{user?.username}</div>

            <small style={{ color: "#94a3b8" }}>{user?.role}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
