import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  getLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../controllers/leaveTypeController.js";

const leaveTypeRouter = express.Router();

leaveTypeRouter.get("/leave-types", authMiddleware, getLeaveTypes);

leaveTypeRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("LEAVE_TYPES", "canCreate"),
  createLeaveType,
);

leaveTypeRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAVE_TYPES", "canEdit"),
  updateLeaveType,
);

leaveTypeRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAVE_TYPES", "canDelete"),
  deleteLeaveType,
);

export default leaveTypeRouter;
