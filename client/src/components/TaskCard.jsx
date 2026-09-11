import { useRef, useState } from "react";
import "./TaskCard.css";

const priorityClass = {
  HIGH: "priority-high",
  MEDIUM: "priority-medium",
  LOW: "priority-low",
};

function TaskCard({ task, columns, onStatusChange, onDelete, onAttach, onEdit }) {
  const fileInputRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFileSelected = (e) => {
    const file = e.target.files[0];

    if (file) {
      onAttach(task._id, file);
    }

    e.target.value = "";
  };

  const handleEditClick = () => {
    setMenuOpen(false);
    onEdit();
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    onDelete(task._id);
  };

  const handleAttachClick = () => {
    setMenuOpen(false);
    fileInputRef.current.click();
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <p className="task-title">{task.title}</p>

        <div className="card-menu-wrapper">
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            more
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={handleEditClick}>Edit</button>

              <button onClick={handleAttachClick}>
                Attach File
              </button>

              <button
                className="danger"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <span
        className={`priority-badge ${priorityClass[task.priority]}`}
      >
        {task.priority}
      </span>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-meta">
        {task.category && (
          <span className="meta-tag category-tag">
            {task.category}
          </span>
        )}

        {task.dueDate && (
          <span className="meta-tag due-tag">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {task.attachments && task.attachments.length > 0 && (
        <div className="attachment-list">
          {task.attachments.map((file, i) => (
            <a
              key={i}
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="attachment-link"
            >
              {file.fileName}
            </a>
          ))}
        </div>
      )}

      {task.status === "NEED_DECISION" && task.decisionDetails && (
        <div className="decision-box">
          <strong>Decision needed:</strong>{" "}
          {task.decisionDetails}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      <div className="task-actions">
        <select
          className="status-select"
          value={task.status}
          onChange={(e) =>
            onStatusChange(task._id, e.target.value)
          }
        >
          {columns.map((col) => (
            <option key={col.key} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TaskCard;