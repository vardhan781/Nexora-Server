import {
  clockInService,
  clockOutService,
  getMonthlyAttendanceCalendarService,
  getTodayAttendanceService,
  runAttendanceSchedulerService,
} from "../services/attendanceService.js";

export const getTodayAttendance = async (req, res) => {
  try {
    const attendance = await getTodayAttendanceService(req.user._id);

    res.status(200).json({
      success: true,
      data: attendance,
      message: "Today's attendance fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const clockIn = async (req, res) => {
  try {
    const attendance = await clockInService(req.user._id);

    res.status(201).json({
      success: true,
      data: attendance,
      message: "Clock in successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const clockOut = async (req, res) => {
  try {
    const attendance = await clockOutService(req.user._id);

    res.status(200).json({
      success: true,
      data: attendance,
      message: "Clock out successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Attendance Scheduler
export const runAttendanceScheduler = async (req, res) => {
  try {
    const date = req.body.date ? new Date(req.body.date) : new Date();

    const result = await runAttendanceSchedulerService(date);

    res.status(200).json({
      success: true,
      data: result,
      message: "Attendance scheduler executed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlyAttendanceCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required.",
      });
    }

    const attendance = await getMonthlyAttendanceCalendarService(
      req.user._id,
      Number(month),
      Number(year),
    );

    res.status(200).json({
      success: true,
      data: attendance,
      message: "Attendance calendar fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
