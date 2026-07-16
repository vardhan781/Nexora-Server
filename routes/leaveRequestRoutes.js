import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  getMyLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} from "../controllers/leaveRequestController.js";

const leaveRequestRouter = express.Router();

leaveRequestRouter.get("/my", authMiddleware, getMyLeaveRequests);

leaveRequestRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("MY_REQUESTS", "canCreate"),
  createLeaveRequest,
);

leaveRequestRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("MY_REQUESTS", "canEdit"),
  updateLeaveRequest,
);

leaveRequestRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("MY_REQUESTS", "canDelete"),
  deleteLeaveRequest,
);

export default leaveRequestRouter;
