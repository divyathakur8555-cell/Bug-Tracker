
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to sign in. Please try again."
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
 <span
  className="eyebrow"
  style={{
    color: "#5145cd",
    fontWeight: "1000",
    fontSize: "15px",
    letterSpacing: "2px",
    textShadow: "0.4px 0 currentColor, -0.4px 0 currentColor",
  }}
>
  WELCOME BACK
</span>
          <h1>
            Great work
            <br />
            starts with
            <br />
            <span style={{ color: "#8b83ff" }}>
              clear focus.
            </span>
          </h1>

          <p>
            Bring your projects, tasks, and team together.
            Pick up where you left off and keep making progress.
          </p>

          <div className="art-card">

            <div className="mini-top">
              <span>YOUR WORKSPACE</span>
              <span className="live-dot">● ACTIVE</span>
            </div>

            <div
              style={{
                margin: "22px 0 8px",
                color: "#fff",
                fontSize: "14px",
              }}
            >
              Your next big milestone
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
              <b>Keep moving forward</b>
              <span>One task at a time</span>
            </div>

          </div>
        </div>

        <p className="art-foot">
          PLAN · TRACK · ACCOMPLISH
        </p>

      </section>

      {/* Right login form */}
      <section className="auth-form-wrap">

        <div className="auth-form">

          <span className="eyebrow">
            YOUR WORKSPACE AWAITS
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
  Welcome back
</h2>

          <p className="muted">
            Sign in to continue to your Trackwise account.
          </p>

          <form onSubmit={submit}>

            {/* Email */}
            <label htmlFor="login-email">
              Email address

              <input
                id="login-email"
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
            <label htmlFor="login-password">
              Password

              <div style={{ position: "relative" }}>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                ? "Signing in..."
                : "Sign in to Trackwise →"}
            </button>

          </form>

          <p className="switch-auth">
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>

          <p
            className="muted"
            style={{
              textAlign: "center",
              marginTop: "45px",
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
