import { useState } from "react";
import "./TaskModal.css";

const statusOptions = ["TODO", "IN_PROGRESS", "NEED_DECISION", "DONE"];
const priorityOptions = ["LOW", "MEDIUM", "HIGH"];

function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "TODO",
    priority: task?.priority || "MEDIUM",
    category: task?.category || "",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    decisionDetails: task?.decisionDetails || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{task ? "Edit Task" : "Create New Task"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Task title" required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Task description" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Frontend" />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
          </div>

          {form.status === "NEED_DECISION" && (
            <div className="form-group">
              <label>Decision Details</label>
              <textarea
                name="decisionDetails"
                value={form.decisionDetails}
                onChange={handleChange}
                rows={2}
                placeholder="What decision is needed?"
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">{task ? "Update Task" : "Create Task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;