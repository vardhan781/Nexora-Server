import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import upload from "../middlewares/upload.js";
import {
  createEmployeeController,
  getEmployeesController,
  updateEmployeeController,
  deleteEmployeeController,
} from "../controllers/employeeController.js";

const employeeRouter = express.Router();

employeeRouter.get("/employees", authMiddleware, getEmployeesController);

employeeRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("EMPLOYEES", "canCreate"),
  upload.single("profileImage"),
  createEmployeeController,
);

employeeRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEES", "canEdit"),
  upload.single("profileImage"),
  updateEmployeeController,
);

/**
 * DELETE EMPLOYEE (SOFT DELETE)
 */
employeeRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("EMPLOYEES", "canDelete"),
  deleteEmployeeController,
);

export default employeeRouter;
