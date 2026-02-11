const { supabase, supabaseAdmin } = require("../supabase/client");
const createHttpError = require("../utils/httpError");
const { sendSuccess } = require("../utils/response");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.session) {
      throw createHttpError(401, error?.message || "Invalid credentials");
    }

    return sendSuccess(
      res,
      {
        session: data.session,
        user: data.user,
      },
      "Login successful",
    );
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw createHttpError(400, "Invalid user session");
    }

    const { error } = await supabaseAdmin.auth.admin.signOut(userId);

    if (error) {
      throw createHttpError(500, error.message || "Logout failed");
    }

    return sendSuccess(res, null, "Logout successful");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  login,
  logout,
};
