
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
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Trackwise</h1>

        <p className="muted">Sign in to your workspace</p>

        <form className="form" onSubmit={submit}>
          <label htmlFor="login-email">
            Email address

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Enter your registered email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </label>

          <label htmlFor="login-password">
            Password

            <div className="password-input-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="muted">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
