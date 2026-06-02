import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "backend_developer",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/simulation`, {
      state: {
        role: formData.role,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="position-relative overflow-hidden rounded-4 p-4"
      style={{
        background: `
          linear-gradient(
            145deg,
            rgba(10,15,30,0.92),
            rgba(6,10,22,0.96)
          )
        `,
        border: "1px solid rgba(0,229,252,0.12)",
        backdropFilter: "blur(18px)",

        boxShadow: `
          0 25px 80px rgba(0,0,0,0.55),
          0 0 0 1px rgba(255,255,255,0.02),
          inset 0 1px 1px rgba(255,255,255,0.03)
        `,
      }}
    >
      {/* Ambient glow */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "220px",
          height: "220px",
          top: "-120px",
          left: "-80px",
          background: "rgba(0,229,255,0.05)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="position-absolute"
        style={{
          top: 0,
          left: "10%",
          width: "80%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />

      <div className="position-relative">
        {/* Full Name */}
        <div className="mb-4">
          <label
            className="form-label fw-semibold"
            style={{
              color: "#bae6fd",
              opacity: 0.9,
            }}
          >
            Full Name
          </label>

          <input
            type="text"
            name="name"
            className="form-control border-0 text-light shadow-none rounded-4"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              background: "rgba(15,23,42,0.88)",
              border: "1px solid rgba(0,229,255,0.10)",
              padding: "14px 16px",

              color: "#e0f2fe",

              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.03),
                0 0 18px rgba(0,229,255,0.04)
              `,
            }}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className="form-label fw-semibold"
            style={{
              color: "#bae6fd",
              opacity: 0.9,
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            name="email"
            className="form-control border-0 text-light shadow-none rounded-4"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              background: "rgba(15,23,42,0.88)",
              border: "1px solid rgba(0,229,255,0.10)",
              padding: "14px 16px",

              color: "#e0f2fe",

              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.03),
                0 0 18px rgba(0,229,255,0.04)
              `,
            }}
          />
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold"
            style={{
              color: "#bae6fd",
              opacity: 0.9,
            }}
          >
            Role
          </label>
          <select
            name="role"
            className="form-select border-0 text-light shadow-none rounded-4"
            value={formData.role}
            onChange={handleChange}
            required
            style={{
              background: "rgba(15,23,42,0.88)",
              border: "1px solid rgba(0,229,255,0.10)",
              padding: "14px 16px",
              color: "#e0f2fe",

              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.03),
                0 0 18px rgba(0,229,255,0.04)
              `,
            }}
          >
            <option value="backend_developer">Backend Developer</option>
            <option value="full_stack_developer">Full Stack Developer</option>
            <option value="devops_engineer">DevOps Engineer</option>
            <option value="qa_engineer">QA Engineer</option>
            <option value="data_engineer">Data Engineer</option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="btn w-100 py-3 fw-semibold rounded-4 text-light"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(0,229,255,0.20),
                rgba(59,130,246,0.20)
              )
            `,

            border: "1px solid rgba(0,229,255,0.16)",

            backdropFilter: "blur(10px)",

            boxShadow: `
              0 0 20px rgba(0,229,255,0.08),
              inset 0 1px 1px rgba(255,255,255,0.04)
            `,

            transition: "0.3s",
          }}
        >
          Start Simulation
        </button>
      </div>
    </form>
  );
}

export default UserForm;
