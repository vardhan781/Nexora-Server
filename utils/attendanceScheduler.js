import cron from "node-cron";
import { runAttendanceSchedulerService } from "../services/attendanceService.js";
import { startOfGivenDay } from "./dateUtils.js";

export const startAttendanceScheduler = () => {
  cron.schedule(
    "5 0 * * *",
    async () => {
      try {
        const yesterday = startOfGivenDay(
          new Date(Date.now() - 24 * 60 * 60 * 1000),
        );

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
