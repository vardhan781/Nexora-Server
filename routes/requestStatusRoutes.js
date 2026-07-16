import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createRequestStatus,
  deleteRequestStatus,
  getRequestStatuses,
  updateRequestStatus,
} from "../controllers/requestStatusController.js";

const requestStatusRouter = express.Router();

requestStatusRouter.get(
  "/request-statuses",
  authMiddleware,
  getRequestStatuses,
);

requestStatusRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("REQUEST_STATUS", "canCreate"),
  createRequestStatus,
);

requestStatusRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("REQUEST_STATUS", "canEdit"),
  updateRequestStatus,
);

requestStatusRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("REQUEST_STATUS", "canDelete"),
  deleteRequestStatus,
);

export default requestStatusRouter;
