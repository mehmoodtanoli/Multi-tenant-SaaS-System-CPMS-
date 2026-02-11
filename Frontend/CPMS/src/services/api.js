import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  timeout: 10000,
});

const unwrap = (response) => response.data?.data ?? response.data;

const api = {
  setToken(token) {
    apiClient.defaults.headers.common.Authorization = token
      ? `Bearer ${token}`
      : undefined;
  },
  async login(payload) {
    const response = await apiClient.post("/api/auth/login", payload);
    const data = unwrap(response);
    if (data?.session?.access_token) {
      api.setToken(data.session.access_token);
    }
    return data;
  },
  async logout() {
    await apiClient.post("/api/auth/logout");
    api.setToken(null);
  },
  async getProjects() {
    const response = await apiClient.get("/api/projects");
    return unwrap(response);
  },
  async createProject(payload) {
    const response = await apiClient.post("/api/projects", payload);
    return unwrap(response);
  },
  async updateProject(id, payload) {
    const response = await apiClient.patch(`/api/projects/${id}`, payload);
    return unwrap(response);
  },
  async deleteProject(id) {
    const response = await apiClient.delete(`/api/projects/${id}`);
    return unwrap(response);
  },
  async getTasks(projectId) {
    const response = await apiClient.get("/api/tasks", {
      params: projectId ? { project_id: projectId } : undefined,
    });
    return unwrap(response);
  },
  async createTask(payload) {
    const response = await apiClient.post("/api/tasks", payload);
    return unwrap(response);
  },
  async updateTask(id, payload) {
    const response = await apiClient.patch(`/api/tasks/${id}`, payload);
    return unwrap(response);
  },
  async deleteTask(id) {
    const response = await apiClient.delete(`/api/tasks/${id}`);
    return unwrap(response);
  },
  async getDashboardStats() {
    const response = await apiClient.get("/api/dashboard/stats");
    return unwrap(response);
  },
  async getMembers() {
    const response = await apiClient.get("/api/members");
    return unwrap(response);
  },
  async createMember(payload) {
    const response = await apiClient.post("/api/members", payload);
    return unwrap(response);
  },
  async updateMember(id, payload) {
    const response = await apiClient.patch(`/api/members/${id}`, payload);
    return unwrap(response);
  },
  async deleteMember(id) {
    const response = await apiClient.delete(`/api/members/${id}`);
    return unwrap(response);
  },
  async getProjectAssignments() {
    const response = await apiClient.get("/api/projects/members");
    return unwrap(response);
  },
  async setProjectMembers(projectId, memberIds) {
    const response = await apiClient.put(`/api/projects/${projectId}/members`, {
      member_ids: memberIds,
    });
    return unwrap(response);
  },
  async getTaskAssignments() {
    const response = await apiClient.get("/api/tasks/members");
    return unwrap(response);
  },
  async setTaskMembers(taskId, memberIds) {
    const response = await apiClient.put(`/api/tasks/${taskId}/members`, {
      member_ids: memberIds,
    });
    return unwrap(response);
  },
};

export default api;
