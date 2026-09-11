import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  assignLead,
  convertLead,
  createLead,
  deleteLead,
  getLeadById,
  getLeadStats,
  getLeads,
  getMyLeads,
  updateLead,
  updateLeadStatus,
} from "../controllers/leadController.js";

const leadRouter = express.Router();

leadRouter.get("/", authMiddleware, getLeads);

leadRouter.get("/stats", authMiddleware, getLeadStats);

leadRouter.get("/my", authMiddleware, getMyLeads);

leadRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("MANAGE_LEADS", "canCreate"),
  createLead,
);

leadRouter.patch(
  "/my/:id/status",
  authMiddleware,
  permissionMiddleware("MY_LEADS", "canEdit"),
  updateLeadStatus,
);

leadRouter.patch(
  "/:id/assign",
  authMiddleware,
  permissionMiddleware("MANAGE_LEADS", "canEdit"),
  assignLead,
);

leadRouter.post(
  "/:id/convert",
  authMiddleware,
  permissionMiddleware("MY_LEADS", "canEdit"),
  convertLead,
);

leadRouter.get("/:id", authMiddleware, getLeadById);

leadRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("MANAGE_LEADS", "canEdit"),
  updateLead,
);

leadRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("MANAGE_LEADS", "canDelete"),
  deleteLead,
);

export default leadRouter;
