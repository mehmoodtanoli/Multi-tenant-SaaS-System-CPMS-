import { useEffect, useMemo, useState } from "react";
import Button from "../components/UI/Button.jsx";
import Card from "../components/UI/Card.jsx";
import Input from "../components/UI/Input.jsx";
import Modal from "../components/UI/Modal.jsx";
import Table from "../components/UI/Table.jsx";
import api from "../services/api.js";

const roleOptions = [
  { value: "member", label: "Member" },
  { value: "lead", label: "Lead" },
  { value: "admin", label: "Admin" },
];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "member",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "member",
  });

  const loadMembers = async () => {
    try {
      const data = await api.getMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load members");
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const rows = useMemo(
    () =>
      members.map((member) => ({
        ...member,
        created_at: formatDate(member.created_at),
      })),
    [members],
  );

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const created = await api.createMember({
        name: form.name,
        email: form.email,
        role: form.role,
      });
      setMembers((prev) => [created, ...prev]);
      setForm({ name: "", email: "", role: "member" });
      setIsModalOpen(false);
    } catch (err) {
      setError(err?.message || "Failed to create member");
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (member) => {
    setEditForm({
      id: member.id,
      name: member.name || "",
      email: member.email || "",
      role: member.role || "member",
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (field) => (event) => {
    setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const updated = await api.updateMember(editForm.id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      });
      setMembers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setIsEditOpen(false);
    } catch (err) {
      setError(err?.message || "Failed to update member");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (memberId) => {
    const confirmed = window.confirm("Delete this member?");
    if (!confirmed) return;
    setError("");
    try {
      await api.deleteMember(memberId);
      setMembers((prev) => prev.filter((item) => item.id !== memberId));
    } catch (err) {
      setError(err?.message || "Failed to delete member");
    }
  };

  const columns = [
    { key: "name", label: "Name", width: "1.4fr" },
    { key: "email", label: "Email", width: "1.6fr" },
    { key: "role", label: "Role", width: "0.8fr" },
    { key: "created_at", label: "Created", width: "0.8fr" },
    { key: "actions", label: "Actions", width: "1.4fr" },
  ];

  const rowsWithActions = rows.map((member) => ({
    ...member,
    actions: (
      <div className="table-actions">
        <Button
          className="small"
          variant="secondary"
          onClick={() => openEdit(member)}
        >
          Edit
        </Button>
        <Button
          className="small"
          variant="secondary"
          onClick={() => handleDelete(member.id)}
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
          <h2 className="page-title">Team members</h2>
          <p className="page-subtitle">
            Assign projects and tasks across delivery squads.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>New Member</Button>
      </div>
      {error ? <div className="ui-error">{error}</div> : null}
      <Card className="table-card">
        <Table columns={columns} data={rowsWithActions} />
      </Card>
      <Modal
        title="Create new member"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Alex Johnson"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="alex@agency.com"
            required
          />
          <label className="ui-input">
            <span>Role</span>
            <select value={form.role} onChange={handleChange("role")}>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              {isSaving ? "Creating..." : "Create member"}
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Edit member"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <form onSubmit={handleUpdate}>
          <Input
            label="Name"
            value={editForm.name}
            onChange={handleEditChange("name")}
            placeholder="Alex Johnson"
            required
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={handleEditChange("email")}
            placeholder="alex@agency.com"
            required
          />
          <label className="ui-input">
            <span>Role</span>
            <select value={editForm.role} onChange={handleEditChange("role")}>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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

export default Members;
