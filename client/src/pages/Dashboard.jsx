import { useEffect, useState } from "react";
import "./Dashboard.css";
import Logo from "../components/Logo";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { taskAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

const columns = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "NEED_DECISION", label: "Need Decision" },
  { key: "DONE", label: "Done" },
];

const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    try {
      const data = await taskAPI.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await taskAPI.updateStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskAPI.delete(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAttach = async (taskId, file) => {
    try {
      const updated = await taskAPI.addAttachment(taskId, file);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await taskAPI.update(editingTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? updated : t)));
      } else {
        const created = await taskAPI.create(taskData);
        setTasks((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const sortedTasksFor = (statusKey) =>
    tasks
      .filter((t) => t.status === statusKey)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  if (loading) return <div className="dashboard-loading">Loading tasks...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Logo />
        <div className="header-actions">
          <span className="welcome-text">Hi, {user?.name}</span>
          <button className="add-task-btn" onClick={openAddModal}>+ Add Task</button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="board">
        {columns.map((column) => (
          <div className="board-column" key={column.key}>
            <h2 className="column-title">
              {column.label}
              <span className="column-count">{sortedTasksFor(column.key).length}</span>
            </h2>

            <div className="task-list">
              {sortedTasksFor(column.key).map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  columns={columns}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onAttach={handleAttach}
                  onEdit={() => openEditModal(task)}
                />
              ))}
              {sortedTasksFor(column.key).length === 0 && (
                <p className="empty-column">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <TaskModal task={editingTask} onSave={handleSaveTask} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

export default Dashboard;