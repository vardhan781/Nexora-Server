import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  addTaskComment,
  createTask,
  deleteTask,
  getMyTasks,
  getTaskById,
  getTaskComments,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", authMiddleware, getTasks);

taskRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("MANAGE_TASKS", "canCreate"),
  createTask,
);

taskRouter.get("/my/tasks", authMiddleware, getMyTasks);

taskRouter.patch(
  "/my/:id/status",
  authMiddleware,
  permissionMiddleware("MY_TASKS", "canEdit"),
  updateTaskStatus,
);

taskRouter.post(
  "/my/:id/comment",
  authMiddleware,
  permissionMiddleware("MY_TASKS", "canEdit"),
  addTaskComment,
);

taskRouter.get("/my/:id/comments", authMiddleware, getTaskComments);

taskRouter.get("/:id", authMiddleware, getTaskById);

taskRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("MANAGE_TASKS", "canEdit"),
  updateTask,
);

taskRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("MANAGE_TASKS", "canDelete"),
  deleteTask,
);

export default taskRouter;
