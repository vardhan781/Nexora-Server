import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  getPayrollSetting,
  createPayrollSetting,
  updatePayrollSetting,
} from "../controllers/payrollSettingController.js";

const payrollSettingRouter = express.Router();

payrollSettingRouter.get("/", authMiddleware, getPayrollSetting);
payrollSettingRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("PAYROLL_SETTINGS", "canCreate"),
  createPayrollSetting,
);
payrollSettingRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("PAYROLL_SETTINGS", "canEdit"),
  updatePayrollSetting,
);

export default payrollSettingRouter;
