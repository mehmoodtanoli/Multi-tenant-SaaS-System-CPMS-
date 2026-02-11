const { supabaseAdmin } = require("../supabase/client");
const createHttpError = require("../utils/httpError");
const { sendSuccess } = require("../utils/response");

const getStats = async (req, res, next) => {
  try {
    const [projectsCount, tasksCount, activeProjectsCount] = await Promise.all([
      supabaseAdmin.from("projects").select("id", {
        count: "exact",
        head: true,
      }),
      supabaseAdmin.from("tasks").select("id", {
        count: "exact",
        head: true,
      }),
      supabaseAdmin
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
    ]);

    if (projectsCount.error || tasksCount.error || activeProjectsCount.error) {
      throw createHttpError(500, "Failed to fetch dashboard stats");
    }

    return sendSuccess(
      res,
      {
        totalProjects: projectsCount.count || 0,
        totalTasks: tasksCount.count || 0,
        activeProjects: activeProjectsCount.count || 0,
      },
      "Dashboard stats fetched",
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getStats,
};
