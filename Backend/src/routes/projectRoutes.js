const express = require("express");
const { body, param } = require("express-validator");

const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("description").optional().isString(),
    body("status").optional().isString(),
  ],
  validateRequest,
  projectController.createProject,
);

router.get("/", authMiddleware, projectController.getProjects);

router.get("/members", authMiddleware, projectController.getProjectMembers);

router.get(
  "/:id/members",
  authMiddleware,
  [param("id").isString().notEmpty().withMessage("Project id is required")],
  validateRequest,
  projectController.getProjectMembersByProject,
);

router.put(
  "/:id/members",
  authMiddleware,
  [
    param("id").isString().notEmpty().withMessage("Project id is required"),
    body("member_ids")
      .isArray({ min: 0 })
      .withMessage("member_ids must be an array"),
  ],
  validateRequest,
  projectController.setProjectMembers,
);

router.patch(
  "/:id",
  authMiddleware,
  [
    param("id").isString().notEmpty().withMessage("Project id is required"),
    body("name").optional().isString(),
    body("description").optional().isString(),
    body("status").optional().isString(),
  ],
  validateRequest,
  projectController.updateProject,
);

router.delete(
  "/:id",
  authMiddleware,
  [param("id").isString().notEmpty().withMessage("Project id is required")],
  validateRequest,
  projectController.deleteProject,
);

module.exports = router;
