import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin
        ? "http://127.0.0.1:8000/login"
        : "http://127.0.0.1:8000/signup";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/dashboard");
      } else {
        alert("Account created successfully");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
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
        <h3
          className="text-center mb-4 fw-bold"
          style={{
            color: "#e0f2fe",
          }}
        >
          {isLogin ? "Admin Login" : "Admin Signup"}
        </h3>

        {!isLogin && (
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{
                color: "#bae6fd",
              }}
            >
              Username
            </label>

            <input
              type="text"
              name="username"
              className="form-control border-0 text-light shadow-none rounded-4"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                background: "rgba(15,23,42,0.88)",
                padding: "14px 16px",
                color: "#e0f2fe",
              }}
            />
          </div>
        )}

        <div className="mb-4">
          <label
            className="form-label fw-semibold"
            style={{
              color: "#bae6fd",
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            name="email"
            className="form-control border-0 text-light shadow-none rounded-4"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              background: "rgba(15,23,42,0.88)",
              padding: "14px 16px",
              color: "#e0f2fe",
            }}
          />
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold"
            style={{
              color: "#bae6fd",
            }}
          >
            Password
          </label>

          <input
            type="password"
            name="password"
            className="form-control border-0 text-light shadow-none rounded-4"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              background: "rgba(15,23,42,0.88)",
              padding: "14px 16px",
              color: "#e0f2fe",
            }}
          />
        </div>

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
          }}
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-link text-decoration-none"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: "#7dd3fc",
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default AuthForm;
