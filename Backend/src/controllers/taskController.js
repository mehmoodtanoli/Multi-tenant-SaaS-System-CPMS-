const { supabaseAdmin } = require("../supabase/client");
const createHttpError = require("../utils/httpError");
const { sendSuccess } = require("../utils/response");

const createTask = async (req, res, next) => {
  try {
    const { project_id, title, status } = req.body;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .insert([{ project_id, title, status }])
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to create task");
    }

    return sendSuccess(res, data, "Task created", 201);
  } catch (err) {
    return next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { project_id } = req.query;

    let query = supabaseAdmin.from("tasks").select("*");

    if (project_id) {
      query = query.eq("project_id", project_id);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw createHttpError(500, error.message || "Failed to fetch tasks");
    }

    return sendSuccess(res, data, "Tasks fetched");
  } catch (err) {
    return next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { project_id, title, status } = req.body;

    const updates = {};
    if (project_id !== undefined) updates.project_id = project_id;
    if (title !== undefined) updates.title = title;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      throw createHttpError(400, "No valid fields provided");
    }

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to update task");
    }

    if (!data) {
      throw createHttpError(404, "Task not found");
    }

    return sendSuccess(res, data, "Task updated");
  } catch (err) {
    return next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to delete task");
    }

    if (!data) {
      throw createHttpError(404, "Task not found");
    }

    return sendSuccess(res, data, "Task deleted");
  } catch (err) {
    return next(err);
  }
};

const getTaskMembers = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("task_members")
      .select("task_id, members(id, name, email, role)")
      .order("created_at", { ascending: false });

    if (error) {
      throw createHttpError(
        500,
        error.message || "Failed to fetch assignments",
      );
    }

    return sendSuccess(res, data, "Task members fetched");
  } catch (err) {
    return next(err);
  }
};

const getTaskMembersByTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("task_members")
      .select("task_id, members(id, name, email, role)")
      .eq("task_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      throw createHttpError(
        500,
        error.message || "Failed to fetch assignments",
      );
    }

    return sendSuccess(res, data, "Task members fetched");
  } catch (err) {
    return next(err);
  }
};

const setTaskMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { member_ids: memberIds } = req.body;

    const { error: deleteError } = await supabaseAdmin
      .from("task_members")
      .delete()
      .eq("task_id", id);

    if (deleteError) {
      throw createHttpError(
        500,
        deleteError.message || "Failed to update assignments",
      );
    }

    if (memberIds.length === 0) {
      return sendSuccess(res, [], "Task members updated");
    }

    const payload = memberIds.map((memberId) => ({
      task_id: id,
      member_id: memberId,
    }));

    const { data, error } = await supabaseAdmin
      .from("task_members")
      .insert(payload)
      .select("task_id, members(id, name, email, role)");

    if (error) {
      throw createHttpError(
        500,
        error.message || "Failed to update assignments",
      );
    }

    return sendSuccess(res, data, "Task members updated");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskMembers,
  getTaskMembersByTask,
  setTaskMembers,
};
