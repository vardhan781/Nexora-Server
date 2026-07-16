import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";

const roleRouter = express.Router();

roleRouter.get("/roles", authMiddleware, getAllRoles);

roleRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("ROLES", "canCreate"),
  createRole,
);

roleRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("ROLES", "canEdit"),
  updateRole,
);

roleRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("ROLES", "canDelete"),
  deleteRole,
);

export default roleRouter;
