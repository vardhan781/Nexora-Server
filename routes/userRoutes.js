import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  getUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/users", authMiddleware, getUsersController);

userRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("USERS", "canCreate"),
  createUserController,
);

userRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("USERS", "canEdit"),
  updateUserController,
);

userRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("USERS", "canDelete"),
  deleteUserController,
);

export default userRouter;
