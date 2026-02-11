const { supabaseAdmin } = require("../supabase/client");
const createHttpError = require("../utils/httpError");
const { sendSuccess } = require("../utils/response");

const createMember = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const { data, error } = await supabaseAdmin
      .from("members")
      .insert([{ name, email, role }])
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to create member");
    }

    return sendSuccess(res, data, "Member created", 201);
  } catch (err) {
    return next(err);
  }
};

const getMembers = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw createHttpError(500, error.message || "Failed to fetch members");
    }

    return sendSuccess(res, data, "Members fetched");
  } catch (err) {
    return next(err);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;

    if (Object.keys(updates).length === 0) {
      throw createHttpError(400, "No valid fields provided");
    }

    const { data, error } = await supabaseAdmin
      .from("members")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to update member");
    }

    if (!data) {
      throw createHttpError(404, "Member not found");
    }

    return sendSuccess(res, data, "Member updated");
  } catch (err) {
    return next(err);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("members")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw createHttpError(500, error.message || "Failed to delete member");
    }

    if (!data) {
      throw createHttpError(404, "Member not found");
    }

    return sendSuccess(res, data, "Member deleted");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
};
