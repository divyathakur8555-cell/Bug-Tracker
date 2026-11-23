
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

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (x) {
      setError(x.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="muted">Join your Trackwise workspace</p>

        <form className="form" onSubmit={submit}>
          <label>
            Name
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </label>

          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </label>

          <label>
            Password
            <input
              type="password"
              minLength={8}
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="btn" type="submit">
            Register
          </button>
        </form>

        <p className="muted">
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
