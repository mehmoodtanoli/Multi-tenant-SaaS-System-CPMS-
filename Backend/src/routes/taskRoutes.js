const express = require("express");
const { body, param, query } = require("express-validator");

const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("project_id")
      .isString()
      .notEmpty()
      .withMessage("Project id is required"),
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("status").optional().isString(),
  ],
  validateRequest,
  taskController.createTask,
);

router.get(
  "/",
  authMiddleware,
  [query("project_id").optional().isString()],
  validateRequest,
  taskController.getTasks,
);

router.get("/members", authMiddleware, taskController.getTaskMembers);

router.get(
  "/:id/members",
  authMiddleware,
  [param("id").isString().notEmpty().withMessage("Task id is required")],
  validateRequest,
  taskController.getTaskMembersByTask,
);

router.put(
  "/:id/members",
  authMiddleware,
  [
    param("id").isString().notEmpty().withMessage("Task id is required"),
    body("member_ids")
      .isArray({ min: 0 })
      .withMessage("member_ids must be an array"),
  ],
  validateRequest,
  taskController.setTaskMembers,
);

router.patch(
  "/:id",
  authMiddleware,
  [
    param("id").isString().notEmpty().withMessage("Task id is required"),
    body("project_id").optional().isString(),
    body("title").optional().isString(),
    body("status").optional().isString(),
  ],
  validateRequest,
  taskController.updateTask,
);

router.delete(
  "/:id",
  authMiddleware,
  [param("id").isString().notEmpty().withMessage("Task id is required")],
  validateRequest,
  taskController.deleteTask,
);

module.exports = router;
