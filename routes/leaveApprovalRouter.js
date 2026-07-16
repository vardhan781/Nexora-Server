import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../controllers/leaveApprovalController.js";

const leaveApprovalRouter = express.Router();

leaveApprovalRouter.get("/pending", authMiddleware, getPendingLeaveRequests);

leaveApprovalRouter.patch(
  "/:id/approve",
  authMiddleware,
  permissionMiddleware("MY_APPROVALS", "canApprove"),
  approveLeaveRequest,
);

leaveApprovalRouter.patch(
  "/:id/reject",
  authMiddleware,
  permissionMiddleware("MY_APPROVALS", "canApprove"),
  rejectLeaveRequest,
);

export default leaveApprovalRouter;
