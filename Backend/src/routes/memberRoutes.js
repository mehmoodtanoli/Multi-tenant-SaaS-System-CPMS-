const express = require("express");
const { body, param } = require("express-validator");

const memberController = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("role").optional().isString(),
  ],
  validateRequest,
  memberController.createMember,
);

router.get("/", authMiddleware, memberController.getMembers);

router.patch(
  "/:id",
  authMiddleware,
  [
    param("id").isString().notEmpty().withMessage("Member id is required"),
    body("name").optional().isString(),
    body("email").optional().isEmail(),
    body("role").optional().isString(),
  ],
  validateRequest,
  memberController.updateMember,
);

router.delete(
  "/:id",
  authMiddleware,
  [param("id").isString().notEmpty().withMessage("Member id is required")],
  validateRequest,
  memberController.deleteMember,
);

module.exports = router;
