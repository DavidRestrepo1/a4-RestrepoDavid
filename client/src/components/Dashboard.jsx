import { useEffect, useMemo, useState } from "react";
import TaskForm from "./TaskForm.jsx";
import TaskItem from "./TaskItem.jsx";

export default function Dashboard({ apiBase, token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: token
    }),
    [token]
  );

  const loadTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/tasks`, {
        headers: { Authorization: token }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not fetch tasks");
      }

      setTasks(data);
    } catch (err) {
      setError(err.message || "Could not fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (payload) => {
    const response = await fetch(`${apiBase}/api/tasks`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Could not create task");
    }

    setTasks((current) => [data, ...current]);
  };

  const deleteTask = async (taskId) => {
    const response = await fetch(`${apiBase}/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Could not delete task");
    }

    setTasks((current) => current.filter((task) => task._id !== taskId));
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Authenticated workspace</p>
            <h1>Your Tasks</h1>
            <p className="subtle">Easy adds 2 days, Medium adds 5, and Hard adds 10.</p>
          </div>
          <div className="header-actions">
            <button className="secondary-btn" onClick={loadTasks}>Refresh</button>
            <button className="danger-btn" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <TaskForm onAddTask={addTask} />

        {error ? <p className="message error">{error}</p> : null}

        <section className="task-section">
          <div className="section-title-row">
            <h2>Task List</h2>
            <span className="pill">{tasks.length} total</span>
          </div>

          {loading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add one above.</p>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskItem key={task._id} task={task} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
