import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getTodayAttendance,
  clockIn,
  clockOut,
  runAttendanceScheduler,
  getMonthlyAttendanceCalendar,
} from "../controllers/attendanceController.js";

const attendanceRouter = express.Router();

attendanceRouter.get("/today", authMiddleware, getTodayAttendance);
attendanceRouter.post("/clock-in", authMiddleware, clockIn);
attendanceRouter.post("/clock-out", authMiddleware, clockOut);
attendanceRouter.get("/calendar", authMiddleware, getMonthlyAttendanceCalendar);

// Attendance Scheduler (HR/Admin)
attendanceRouter.post("/run-scheduler", authMiddleware, runAttendanceScheduler);

export default attendanceRouter;
