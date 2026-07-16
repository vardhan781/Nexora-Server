import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  getLeaveBalances,
  createLeaveBalance,
  updateLeaveBalance,
  deleteLeaveBalance,
  getMyLeaveBalances,
} from "../controllers/leaveBalanceController.js";

const leaveBalanceRouter = express.Router();

leaveBalanceRouter.get("/leave-balances", authMiddleware, getLeaveBalances);

leaveBalanceRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("LEAVE_BALANCES", "canCreate"),
  createLeaveBalance,
);

leaveBalanceRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAVE_BALANCES", "canEdit"),
  updateLeaveBalance,
);

leaveBalanceRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("LEAVE_BALANCES", "canDelete"),
  deleteLeaveBalance,
);

leaveBalanceRouter.get("/my", authMiddleware, getMyLeaveBalances);

export default leaveBalanceRouter;
