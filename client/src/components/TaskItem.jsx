function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function TaskItem({ task, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <div>
          <h3>{task.title}</h3>
          <span className={`badge ${String(task.difficulty || "").toLowerCase()}`}>
            {task.difficulty}
          </span>
        </div>
        <button className="icon-btn" onClick={() => onDelete(task._id)} aria-label={`Delete ${task.title}`}>
          Delete
        </button>
      </div>

      <dl className="meta-grid">
        <div>
          <dt>Created</dt>
          <dd>{formatDate(task.createdAt)}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>{formatDate(task.dueDate)}</dd>
        </div>
      </dl>
    </article>
  );
}
