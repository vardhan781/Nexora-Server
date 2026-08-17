import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  createLeadStatus,
  deleteLeadStatus,
  getLeadStatuses,
  updateLeadStatus,
} from "../controllers/leadStatusController.js";

const leadStatusRouter = express.Router();

leadStatusRouter.get("/lead-status", authMiddleware, getLeadStatuses);

leadStatusRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("LEAD_STATUS", "canCreate"),
  createLeadStatus,
);

leadStatusRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAD_STATUS", "canEdit"),
  updateLeadStatus,
);

leadStatusRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAD_STATUS", "canDelete"),
  deleteLeadStatus,
);

export default leadStatusRouter;
