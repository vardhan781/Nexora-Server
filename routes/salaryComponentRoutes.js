import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  getSalaryComponents,
  getSalaryComponentById,
  createSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
} from "../controllers/salaryComponentController.js";

const salaryComponentRouter = express.Router();

salaryComponentRouter.get("/", authMiddleware, getSalaryComponents);
salaryComponentRouter.get("/:id", authMiddleware, getSalaryComponentById);
salaryComponentRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("SALARY_COMPONENTS", "canCreate"),
  createSalaryComponent,
);
salaryComponentRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("SALARY_COMPONENTS", "canEdit"),
  updateSalaryComponent,
);
salaryComponentRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("SALARY_COMPONENTS", "canDelete"),
  deleteSalaryComponent,
);

export default salaryComponentRouter;
