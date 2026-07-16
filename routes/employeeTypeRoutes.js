import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createEmployeeType,
  deleteEmployeeType,
  getEmployeeTypes,
  updateEmployeeType,
} from "../controllers/employeeTypeController.js";

const employeeTypeRouter = express.Router();

employeeTypeRouter.get("/employee-types", authMiddleware, getEmployeeTypes);

employeeTypeRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_TYPES", "canCreate"),
  createEmployeeType,
);

employeeTypeRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_TYPES", "canEdit"),
  updateEmployeeType,
);

employeeTypeRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEE_TYPES", "canDelete"),
  deleteEmployeeType,
);

export default employeeTypeRouter;
