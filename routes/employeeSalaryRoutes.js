import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  getEmployeeSalaryList,
  getEmployeeSalaryById,
  getEmployeeSalaryHistory,
  createEmployeeSalary,
  updateEmployeeSalary,
  deleteEmployeeSalary,
} from "../controllers/employeeSalaryController.js";

const employeeSalaryRouter = express.Router();

employeeSalaryRouter.get("/", authMiddleware, getEmployeeSalaryList);
employeeSalaryRouter.get(
  "/history/:employeeId",
  authMiddleware,
  getEmployeeSalaryHistory,
);
employeeSalaryRouter.get("/:id", authMiddleware, getEmployeeSalaryById);
employeeSalaryRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_SALARY", "canCreate"),
  createEmployeeSalary,
);
employeeSalaryRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_SALARY", "canEdit"),
  updateEmployeeSalary,
);
employeeSalaryRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_SALARY", "canDelete"),
  deleteEmployeeSalary,
);

export default employeeSalaryRouter;
