import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  generatePayroll,
  generateAllPayroll,
  getPayroll,
  getPayrollById,
} from "../controllers/payrollController.js";

const payrollRouter = express.Router();
payrollRouter.get("/", authMiddleware, getPayroll);
payrollRouter.get("/:id", authMiddleware, getPayrollById);
payrollRouter.post(
  "/generate",
  authMiddleware,
  permissionMiddleware("PAYROLL_SERVICE", "canCreate"),
  generatePayroll,
);
payrollRouter.post(
  "/generate-all",
  authMiddleware,
  permissionMiddleware("PAYROLL_SERVICE", "canCreate"),
  generateAllPayroll,
);

export default payrollRouter;
