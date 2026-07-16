import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createMenu,
  deleteMenu,
  getAllMenus,
  getSidebarMenus,
  updateMenu,
} from "../controllers/menuController.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

const menuRouter = express.Router();

menuRouter.get("/sidebar", authMiddleware, getSidebarMenus);
menuRouter.get("/menus", authMiddleware, getAllMenus);
menuRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("MENUS", "canCreate"),
  createMenu,
);
menuRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("MENUS", "canEdit"),
  updateMenu,
);
menuRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("MENUS", "canDelete"),
  deleteMenu,
);

export default menuRouter;
