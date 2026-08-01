import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createTaskPriority,
  deleteTaskPriority,
  getTaskPriorities,
  updateTaskPriority,
} from "../controllers/taskPriorityController.js";

const taskPriorityRouter = express.Router();

taskPriorityRouter.get("/task-priority", authMiddleware, getTaskPriorities);

taskPriorityRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("TASK_PRIORITY", "canCreate"),
  createTaskPriority,
);

taskPriorityRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("TASK_PRIORITY", "canEdit"),
  updateTaskPriority,
);

taskPriorityRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("TASK_PRIORITY", "canDelete"),
  deleteTaskPriority,
);

export default taskPriorityRouter;
