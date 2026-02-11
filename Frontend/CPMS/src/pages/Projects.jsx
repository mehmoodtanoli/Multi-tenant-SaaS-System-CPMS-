import { useEffect, useMemo, useState } from "react";
import Button from "../components/UI/Button.jsx";
import Card from "../components/UI/Card.jsx";
import Input from "../components/UI/Input.jsx";
import Modal from "../components/UI/Modal.jsx";
import Table from "../components/UI/Table.jsx";
import api from "../services/api.js";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectMemberNames, setProjectMemberNames] = useState({});
  const [projectMemberIds, setProjectMemberIds] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
    member_ids: [],
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    description: "",
    status: "active",
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
      const data = await api.getProjectAssignments();
      const namesMap = {};
      const idsMap = {};
      (Array.isArray(data) ? data : []).forEach((entry) => {
        const projectId = entry.project_id;
        const member = entry.members;
        if (!projectId || !member) return;
        if (!namesMap[projectId]) namesMap[projectId] = [];
        if (!idsMap[projectId]) idsMap[projectId] = [];
        namesMap[projectId].push(member.name || member.email || "Member");
        idsMap[projectId].push(member.id);
      });
      setProjectMemberNames(namesMap);
      setProjectMemberIds(idsMap);
    } catch (err) {
      setError(err?.message || "Failed to load assignments");
    }
  };

  useEffect(() => {
    loadProjects();
    loadMembers();
    loadAssignments();
  }, []);

  const rows = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        status: formatStatus(project.status),
        created_at: formatDate(project.created_at),
      })),
    [projects],
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
      const created = await api.createProject({
        name: form.name,
        description: form.description || null,
        status: form.status,
      });
      if (form.member_ids.length > 0) {
        await api.setProjectMembers(created.id, form.member_ids);
        const selectedNames = members
          .filter((member) => form.member_ids.includes(member.id))
          .map((member) => member.name || member.email);
        setProjectMemberNames((prev) => ({
          ...prev,
          [created.id]: selectedNames,
        }));
        setProjectMemberIds((prev) => ({
          ...prev,
          [created.id]: [...form.member_ids],
        }));
      }
      setProjects((prev) => [created, ...prev]);
      setForm({ name: "", description: "", status: "active", member_ids: [] });
      setIsModalOpen(false);
    } catch (err) {
      setError(err?.message || "Failed to create project");
    } finally {
      setIsSaving(false);
    }
  };
  const openEdit = (project) => {
    setEditForm({
      id: project.id,
      name: project.name || "",
      description: project.description || "",
      status: project.status || "active",
      member_ids: projectMemberIds[project.id] || [],
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
      const updated = await api.updateProject(editForm.id, {
        name: editForm.name,
        description: editForm.description || null,
        status: editForm.status,
      });
      await api.setProjectMembers(updated.id, editForm.member_ids);
      const selectedNames = members
        .filter((member) => editForm.member_ids.includes(member.id))
        .map((member) => member.name || member.email);
      setProjectMemberNames((prev) => ({
        ...prev,
        [updated.id]: selectedNames,
      }));
      setProjectMemberIds((prev) => ({
        ...prev,
        [updated.id]: [...editForm.member_ids],
      }));
      setProjects((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setIsEditOpen(false);
    } catch (err) {
      setError(err?.message || "Failed to update project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;
    setError("");
    try {
      await api.deleteProject(projectId);
      setProjects((prev) => prev.filter((item) => item.id !== projectId));
      setProjectMemberNames((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
      setProjectMemberIds((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
    } catch (err) {
      setError(err?.message || "Failed to delete project");
    }
  };

  const markCompleted = async (project) => {
    if (project.status === "completed") return;
    setError("");
    try {
      const updated = await api.updateProject(project.id, {
        status: "completed",
      });
      setProjects((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(err?.message || "Failed to mark completed");
    }
  };
  const columns = [
    { key: "name", label: "Project", width: "2fr" },
    { key: "members", label: "Members", width: "1.4fr" },
    { key: "status", label: "Status", width: "1fr" },
    { key: "created_at", label: "Created", width: "1fr" },
    { key: "actions", label: "Actions", width: "2fr" },
  ];

  const rowsWithActions = rows.map((project) => ({
    ...project,
    members: projectMemberNames[project.id]?.join(", ") || "Unassigned",
    actions: (
      <div className="table-actions">
        <Button
          className="small"
          variant="secondary"
          onClick={() => openEdit(project)}
        >
          Edit
        </Button>
        <Button
          className="small"
          variant="secondary"
          onClick={() => markCompleted(project)}
        >
          Completed
        </Button>
        <Button
          className="small"
          variant="secondary"
          onClick={() => handleDelete(project.id)}
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
          <h2 className="page-title">Projects overview</h2>
          <p className="page-subtitle">
            Plan, prioritize, and keep delivery on track.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>New Project</Button>
      </div>
      {error ? <div className="ui-error">{error}</div> : null}
      <Card className="table-card">
        <Table columns={columns} data={rowsWithActions} />
      </Card>
      <Modal
        title="Create new project"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Project name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Client portal redesign"
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Short summary"
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
              {isSaving ? "Creating..." : "Create project"}
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Edit project"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <form onSubmit={handleUpdate}>
          <Input
            label="Project name"
            value={editForm.name}
            onChange={handleEditChange("name")}
            placeholder="Client portal redesign"
            required
          />
          <Input
            label="Description"
            value={editForm.description}
            onChange={handleEditChange("description")}
            placeholder="Short summary"
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

export default Projects;
