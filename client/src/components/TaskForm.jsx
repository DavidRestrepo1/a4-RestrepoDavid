import { useState } from "react";

const difficulties = ["Easy", "Medium", "Hard"];

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onAddTask({ title, difficulty });
      setTitle("");
      setDifficulty("Easy");
    } catch (err) {
      setError(err.message || "Could not add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel-card">
      <div className="section-title-row">
        <h2>Create a task</h2>
      </div>

      <form onSubmit={handleSubmit} className="task-form-row">
        <div className="task-input-group grow">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Finish assignment, study chapter 4, call client..."
            required
          />
        </div>

        <div className="task-input-group narrow">
          <label htmlFor="task-difficulty">Difficulty</label>
          <select
            id="task-difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            {difficulties.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <button className="primary-btn add-btn" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add task"}
        </button>
      </form>

      {error ? <p className="message error">{error}</p> : null}
    </section>
  );
}
