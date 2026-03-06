import { useMemo, useState } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const apiBase = useMemo(() => API_URL.replace(/\/$/, ""), []);

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setScreen("login");
  };

  if (token) {
    return <Dashboard apiBase={apiBase} token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="page auth-page">
      <div className="auth-shell">
        <div className="hero-card">
          <p className="eyebrow">Productivity app</p>
          <h1>Task Tracker</h1>
          <p className="subtle">
            Register, log in, add tasks, and let the API calculate due dates based on difficulty.
          </p>
        </div>

        <div className="panel-card">
          <div className="tab-row">
            <button
              className={screen === "login" ? "tab active" : "tab"}
              onClick={() => setScreen("login")}
            >
              Login
            </button>
            <button
              className={screen === "register" ? "tab active" : "tab"}
              onClick={() => setScreen("register")}
            >
              Register
            </button>
          </div>

          {screen === "login" ? (
            <Login apiBase={apiBase} onSuccess={handleAuthSuccess} onSwitch={() => setScreen("register")} />
          ) : (
            <Register apiBase={apiBase} onSwitch={() => setScreen("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
