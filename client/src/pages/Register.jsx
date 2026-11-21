
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">

      {/* Left decorative section */}
      <section className="auth-art">

        <Link to="/" className="brand">
          <span className="brand-icon">✦</span>
          Trackwise
        </Link>

        <div className="art-copy">

          <span className="eyebrow">
            GET STARTED TODAY
          </span>

          <h1>
            Make room
            <br />
            for better
            <br />
            <span style={{ color: "#8b83ff" }}>
              teamwork.
            </span>
          </h1>

          <p>
            Create your workspace, organize your projects,
            and give every task a clear direction.
          </p>

          <div className="art-card">

            <div className="mini-top">
              <span>YOUR NEW WORKSPACE</span>
              <span className="live-dot">● READY</span>
            </div>

            <div
              style={{
                margin: "22px 0 8px",
                color: "#fff",
                fontSize: "14px",
              }}
            >
              Everything in one place
            </div>

            <div className="mini-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="mini-bottom">
              <b>Projects. Tasks. Progress.</b>
              <span>Let's get started</span>
            </div>

          </div>
        </div>

        <p className="art-foot">
          PLAN · TRACK · ACCOMPLISH
        </p>

      </section>

      {/* Right registration form */}
      <section className="auth-form-wrap">

        <div className="auth-form">

          <span className="eyebrow">
            CREATE YOUR WORKSPACE
          </span>

          <h2
  style={{
    fontWeight: 900,
    color: "#4B267D",
    WebkitTextFillColor: "#4B267D",
    WebkitTextStroke: "0.5px #4B267D",
    opacity: 1,
  }}
>
  Create your account
</h2>

          <p className="muted">
            Join Trackwise and start managing your work.
          </p>

          <form onSubmit={submit}>

            {/* Full name */}
            <label htmlFor="register-name">
              Full name

              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </label>

            {/* Email */}
            <label htmlFor="register-email">
              Email address

              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </label>

            {/* Password */}
            <label htmlFor="register-password">
              Password

              <div style={{ position: "relative" }}>

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  style={{ paddingRight: "75px" }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#6558e8",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </label>

            {/* Error message */}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              className="primary full"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create my account →"}
            </button>

          </form>

          <p className="switch-auth">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>

          <p
            className="muted"
            style={{
              textAlign: "center",
              marginTop: "35px",
            }}
          >
            © {new Date().getFullYear()} Trackwise.
            All rights reserved.
          </p>

        </div>

      </section>

    </div>
  );
}
