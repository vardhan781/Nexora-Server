import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";

import {
  getAllHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../controllers/holidayController.js";

const holidayRouter = express.Router();

holidayRouter.get("/holidays", authMiddleware, getAllHolidays);

holidayRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("HOLIDAY", "canCreate"),
  createHoliday,
);

holidayRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("HOLIDAY", "canEdit"),
  updateHoliday,
);

holidayRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("HOLIDAY", "canDelete"),
  deleteHoliday,
);

export default holidayRouter;
