const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

// Generic request helper — attaches token, handles JSON vs FormData
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (token) headers.Authorization = `Bearer ${token}`;

  // Don't set Content-Type for FormData — browser sets it automatically with the boundary
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const authAPI = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
};

export const taskAPI = {
  getAll: () => request("/tasks"),
  create: (taskData) => request("/tasks", { method: "POST", body: JSON.stringify(taskData) }),
  update: (id, taskData) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(taskData) }),
  updateStatus: (id, status) =>
    request(`/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  delete: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
  addAttachment: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/tasks/${id}/attachments`, { method: "POST", body: formData });
  },
};