import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import {
  createAttendanceStatus,
  deleteAttendanceStatus,
  getAttendanceStatuses,
  updateAttendanceStatus,
} from "../controllers/attendanceStatusController.js";

const attendanceStatusRouter = express.Router();

attendanceStatusRouter.get(
  "/attendance-statuses",
  authMiddleware,
  getAttendanceStatuses,
);

attendanceStatusRouter.post(
  "/add",
  authMiddleware,
  permissionMiddleware("ATTENDANCE_STATUS", "canCreate"),
  createAttendanceStatus,
);

attendanceStatusRouter.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("ATTENDANCE_STATUS", "canEdit"),
  updateAttendanceStatus,
);

attendanceStatusRouter.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("ATTENDANCE_STATUS", "canDelete"),
  deleteAttendanceStatus,
);

export default attendanceStatusRouter;
