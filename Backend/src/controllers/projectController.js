const { supabaseAdmin } = require("../supabase/client");
const createHttpError = require("../utils/httpError");
const { sendSuccess } = require("../utils/response");

const createProject = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([{ name, description, status }])
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to create project");
    }

    return sendSuccess(res, data, "Project created", 201);
  } catch (err) {
    return next(err);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw createHttpError(500, error.message || "Failed to fetch projects");
    }

    return sendSuccess(res, data, "Projects fetched");
  } catch (err) {
    return next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to delete project");
    }

    if (!data) {
      throw createHttpError(404, "Project not found");
    }

    return sendSuccess(res, data, "Project deleted");
  } catch (err) {
    return next(err);
  }
};

const getProjectMembers = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("project_members")
      .select("project_id, members(id, name, email, role)")
      .order("created_at", { ascending: false });

    if (error) {
      throw createHttpError(
        500,
        error.message || "Failed to fetch assignments",
      );
    }

    return sendSuccess(res, data, "Project members fetched");
  } catch (err) {
    return next(err);
  }
};

const getProjectMembersByProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("project_members")
      .select("project_id, members(id, name, email, role)")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      throw createHttpError(
        500,
        error.message || "Failed to fetch assignments",
      );
    }

    return sendSuccess(res, data, "Project members fetched");
  } catch (err) {
    return next(err);
  }
};

const setProjectMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { member_ids: memberIds } = req.body;

    const { error: deleteError } = await supabaseAdmin
      .from("project_members")
      .delete()
      .eq("project_id", id);

    if (deleteError) {
      throw createHttpError(
        500,
        deleteError.message || "Failed to update assignments",
      );
    }

    if (memberIds.length === 0) {
      return sendSuccess(res, [], "Project members updated");
    }

    const payload = memberIds.map((memberId) => ({
      project_id: id,
      member_id: memberId,
    }));

    const { data, error } = await supabaseAdmin
      .from("project_members")
      .insert(payload)
      .select("project_id, members(id, name, email, role)");

    if (error) {
      throw createHttpError(
        500,
        error.message || "Failed to update assignments",
      );
    }

    return sendSuccess(res, data, "Project members updated");
  } catch (err) {
    return next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      throw createHttpError(400, "No valid fields provided");
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to update project");
    }

    if (!data) {
      throw createHttpError(404, "Project not found");
    }

    return sendSuccess(res, data, "Project updated");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  getProjectMembers,
  getProjectMembersByProject,
  setProjectMembers,
  deleteProject,
};
