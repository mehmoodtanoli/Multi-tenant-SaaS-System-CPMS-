import { useEffect, useMemo, useState } from "react";
import Button from "../components/UI/Button.jsx";
import Card from "../components/UI/Card.jsx";
import Input from "../components/UI/Input.jsx";
import Modal from "../components/UI/Modal.jsx";
import Table from "../components/UI/Table.jsx";
import api from "../services/api.js";

const statusOptions = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "completed", label: "Completed" },
];

const formatStatus = (value) => {
  if (!value) return "Unknown";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [taskMemberNames, setTaskMemberNames] = useState({});
  const [taskMemberIds, setTaskMemberIds] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    project_id: "",
    title: "",
    status: "todo",
    member_ids: [],
  });
  const [editForm, setEditForm] = useState({
    id: "",
    project_id: "",
    title: "",
    status: "todo",
    member_ids: [],
  });

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load projects");
    }
  };

  const loadTasks = async (projectId) => {
    try {
      const data = await api.getTasks(projectId || undefined);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load tasks");
    }
  };

  const loadMembers = async () => {
    try {
      const data = await api.getMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load members");
    }
  };

  const loadAssignments = async () => {
    try {
      const data = await api.getTaskAssignments();
      const namesMap = {};
      const idsMap = {};
      (Array.isArray(data) ? data : []).forEach((entry) => {
        const taskId = entry.task_id;
        const member = entry.members;
        if (!taskId || !member) return;
        if (!namesMap[taskId]) namesMap[taskId] = [];
        if (!idsMap[taskId]) idsMap[taskId] = [];
        namesMap[taskId].push(member.name || member.email || "Member");
        idsMap[taskId].push(member.id);
      });
      setTaskMemberNames(namesMap);
      setTaskMemberIds(idsMap);
    } catch (err) {
      setError(err?.message || "Failed to load assignments");
    }
  };

  useEffect(() => {
    loadProjects();
    loadTasks();
    loadMembers();
    loadAssignments();
  }, []);

  useEffect(() => {
    loadTasks(selectedProject);
  }, [selectedProject]);

  const rows = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        status: formatStatus(task.status),
        created_at: formatDate(task.created_at),
      })),
    [tasks],
  );

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleMultiSelect = (field) => (event) => {
    const selected = Array.from(event.target.selectedOptions).map(
      (option) => option.value,
    );
    setForm((prev) => ({ ...prev, [field]: selected }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const created = await api.createTask({
        project_id: form.project_id,
        title: form.title,
        status: form.status,
      });
      if (form.member_ids.length > 0) {
        await api.setTaskMembers(created.id, form.member_ids);
        const selectedNames = members
          .filter((member) => form.member_ids.includes(member.id))
          .map((member) => member.name || member.email);
        setTaskMemberNames((prev) => ({
          ...prev,
          [created.id]: selectedNames,
        }));
        setTaskMemberIds((prev) => ({
          ...prev,
          [created.id]: [...form.member_ids],
        }));
      }
      setTasks((prev) => [created, ...prev]);
      setForm({ project_id: "", title: "", status: "todo", member_ids: [] });
      setIsModalOpen(false);
    } catch (err) {
      setError(err?.message || "Failed to create task");
    } finally {
      setIsSaving(false);
    }
  };
  const openEdit = (task) => {
    setEditForm({
      id: task.id,
      project_id: task.project_id || "",
      title: task.title || "",
      status: task.status || "todo",
      member_ids: taskMemberIds[task.id] || [],
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (field) => (event) => {
    setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleEditMultiSelect = (field) => (event) => {
    const selected = Array.from(event.target.selectedOptions).map(
      (option) => option.value,
    );
    setEditForm((prev) => ({ ...prev, [field]: selected }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const updated = await api.updateTask(editForm.id, {
        project_id: editForm.project_id,
        title: editForm.title,
        status: editForm.status,
      });
      await api.setTaskMembers(updated.id, editForm.member_ids);
      const selectedNames = members
        .filter((member) => editForm.member_ids.includes(member.id))
        .map((member) => member.name || member.email);
      setTaskMemberNames((prev) => ({
        ...prev,
        [updated.id]: selectedNames,
      }));
      setTaskMemberIds((prev) => ({
        ...prev,
        [updated.id]: [...editForm.member_ids],
      }));
      setTasks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setIsEditOpen(false);
    } catch (err) {
      setError(err?.message || "Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;
    setError("");
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((item) => item.id !== taskId));
      setTaskMemberNames((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      setTaskMemberIds((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    } catch (err) {
      setError(err?.message || "Failed to delete task");
    }
  };

  const markCompleted = async (task) => {
    if (task.status === "completed") return;
    setError("");
    try {
      const updated = await api.updateTask(task.id, { status: "completed" });
      setTasks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(err?.message || "Failed to mark completed");
    }
  };
  const columns = [
    { key: "title", label: "Task", width: "2fr" },
    { key: "members", label: "Assignees", width: "1.4fr" },
    { key: "status", label: "Status", width: "1fr" },
    { key: "created_at", label: "Created", width: "1fr" },
    { key: "actions", label: "Actions", width: "2fr" },
  ];

  const rowsWithActions = rows.map((task) => ({
    ...task,
    members: taskMemberNames[task.id]?.join(", ") || "Unassigned",
    actions: (
      <div className="table-actions">
        <Button
          className="small"
          variant="secondary"
          onClick={() => openEdit(task)}
        >
          Edit
        </Button>
        <Button
          className="small"
          variant="secondary"
          onClick={() => markCompleted(task)}
        >
          Completed
        </Button>
        <Button
          className="small"
          variant="secondary"
          onClick={() => handleDelete(task.id)}
        >
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2 className="page-title">Task flow</h2>
          <p className="page-subtitle">
            Track execution across every active project.
          </p>
        </div>
        <div className="page-actions">
          <label className="ui-input compact">
            <span>Project</span>
            <select
              value={selectedProject}
              onChange={(event) => setSelectedProject(event.target.value)}
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Add Task
          </Button>
        </div>
      </div>
      {error ? <div className="ui-error">{error}</div> : null}
      <Card className="table-card">
        <Table columns={columns} data={rowsWithActions} />
      </Card>
      <Modal
        title="Create new task"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <label className="ui-input">
            <span>Project</span>
            <select
              value={form.project_id}
              onChange={handleChange("project_id")}
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Task title"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="Design review"
            required
          />
          <label className="ui-input">
            <span>Status</span>
            <select value={form.status} onChange={handleChange("status")}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="ui-input">
            <span>Assign members</span>
            <select
              multiple
              value={form.member_ids}
              onChange={handleMultiSelect("member_ids")}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
          </label>
          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Creating..." : "Create task"}
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Edit task"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <form onSubmit={handleUpdate}>
          <label className="ui-input">
            <span>Project</span>
            <select
              value={editForm.project_id}
              onChange={handleEditChange("project_id")}
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Task title"
            value={editForm.title}
            onChange={handleEditChange("title")}
            placeholder="Design review"
            required
          />
          <label className="ui-input">
            <span>Status</span>
            <select
              value={editForm.status}
              onChange={handleEditChange("status")}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="ui-input">
            <span>Assign members</span>
            <select
              multiple
              value={editForm.member_ids}
              onChange={handleEditMultiSelect("member_ids")}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
          </label>
          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
