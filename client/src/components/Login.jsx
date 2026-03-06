import { useState } from "react";

export default function Login({ apiBase, onSuccess, onSwitch }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      onSuccess(data.token);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div>
        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          name="username"
          value={form.username}
          onChange={updateField}
          placeholder="Enter username"
          required
        />
      </div>

      <div>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="Enter password"
          required
        />
      </div>

      {error ? <p className="message error">{error}</p> : null}

      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="helper-text">
        Need an account? <button type="button" className="text-btn" onClick={onSwitch}>Register</button>
      </p>
    </form>
  );
}
