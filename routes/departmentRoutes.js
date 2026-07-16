import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "../controllers/departmentController.js";

const departmentRouter = express.Router();

departmentRouter.get("/departments", authMiddleware, getDepartments);

departmentRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("DEPARTMENTS", "canCreate"),
  createDepartment,
);

departmentRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("DEPARTMENTS", "canEdit"),
  updateDepartment,
);

departmentRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("DEPARTMENTS", "canDelete"),
  deleteDepartment,
);

export default departmentRouter;
