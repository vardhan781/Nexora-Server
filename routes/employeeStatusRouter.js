import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createEmployeeStatus,
  deleteEmployeeStatus,
  getEmployeeStatuses,
  updateEmployeeStatus,
} from "../controllers/employeeStatusController.js";

const employeeStatusRouter = express.Router();

employeeStatusRouter.get(
  "/employee-status",
  authMiddleware,
  getEmployeeStatuses,
);

employeeStatusRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_STATUS", "canCreate"),
  createEmployeeStatus,
);

employeeStatusRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_STATUS", "canEdit"),
  updateEmployeeStatus,
);

employeeStatusRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_STATUS", "canDelete"),
  deleteEmployeeStatus,
);

export default employeeStatusRouter;
