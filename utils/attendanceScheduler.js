import cron from "node-cron";
import { runAttendanceSchedulerService } from "../services/attendanceService.js";

export const startAttendanceScheduler = () => {
  cron.schedule(
    "5 0 * * *",
    async () => {
      try {
        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        yesterday.setHours(0, 0, 0, 0);

        const result = await runAttendanceSchedulerService(yesterday);

        console.log("Attendance scheduler completed", result);
      } catch (error) {
        console.error("Attendance scheduler failed:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
};
