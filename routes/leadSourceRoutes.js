import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  createLeadSource,
  deleteLeadSource,
  getLeadSources,
  updateLeadSource,
} from "../controllers/leadSourceController.js";

const leadSourceRouter = express.Router();

leadSourceRouter.get("/", authMiddleware, getLeadSources);

leadSourceRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("LEAD_SOURCE", "canCreate"),
  createLeadSource,
);

leadSourceRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAD_SOURCE", "canEdit"),
  updateLeadSource,
);

leadSourceRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAD_SOURCE", "canDelete"),
  deleteLeadSource,
);

export default leadSourceRouter;
