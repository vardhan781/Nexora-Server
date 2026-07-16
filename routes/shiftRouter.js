import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift,
} from "../controllers/shiftController.js";

const shiftRouter = express.Router();

shiftRouter.get("/shifts", authMiddleware, getAllShifts);

shiftRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("SHIFT", "canCreate"),
  createShift,
);

shiftRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("SHIFT", "canEdit"),
  updateShift,
);

shiftRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("SHIFT", "canDelete"),
  deleteShift,
);

export default shiftRouter;
