import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  assignClient,
  createClient,
  deleteClient,
  getClientById,
  getClients,
  getMyClients,
  updateClient,
} from "../controllers/clientController.js";

const clientRouter = express.Router();

clientRouter.get("/", authMiddleware, getClients);
clientRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("MANAGE_CLIENTS", "canCreate"),
  createClient,
);
clientRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("MANAGE_CLIENTS", "canEdit"),
  updateClient,
);
clientRouter.patch(
  "/:id/assign",
  authMiddleware,
  permissionMiddleware("MANAGE_CLIENTS", "canEdit"),
  assignClient,
);
clientRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("MANAGE_CLIENTS", "canDelete"),
  deleteClient,
);
clientRouter.get("/my", authMiddleware, getMyClients);
clientRouter.get("/:id", authMiddleware, getClientById);

export default clientRouter;
