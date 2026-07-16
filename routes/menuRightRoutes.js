import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getRoleMenuMatrix,
  updateRolePermissions,
} from "../controllers/menuRightController.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

const menuRightRouter = express.Router();

menuRightRouter.get("/:roleId", authMiddleware, getRoleMenuMatrix);
menuRightRouter.put(
  "/:roleId",
  authMiddleware,
  permissionMiddleware("MENU_RIGHTS", "canCreate"),
  updateRolePermissions,
);

export default menuRightRouter;
