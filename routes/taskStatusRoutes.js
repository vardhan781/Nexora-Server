import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createTaskStatus,
  deleteTaskStatus,
  getTaskStatuses,
  updateTaskStatus,
} from "../controllers/taskStatusController.js";

const taskStatusRouter = express.Router();

taskStatusRouter.get("/task-status", authMiddleware, getTaskStatuses);

taskStatusRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("TASK_STATUS", "canCreate"),
  createTaskStatus,
);

taskStatusRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("TASK_STATUS", "canEdit"),
  updateTaskStatus,
);

taskStatusRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("TASK_STATUS", "canDelete"),
  deleteTaskStatus,
);

export default taskStatusRouter;
