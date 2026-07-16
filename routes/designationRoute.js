import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createDesignation,
  deleteDesignation,
  getDesignations,
  updateDesignation,
} from "../controllers/designationController.js";

const designationRouter = express.Router();

designationRouter.get("/designations", authMiddleware, getDesignations);

designationRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("DESIGNATIONS", "canCreate"),
  createDesignation,
);

designationRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("DESIGNATIONS", "canEdit"),
  updateDesignation,
);

designationRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("DESIGNATIONS", "canDelete"),
  deleteDesignation,
);

export default designationRouter;
