import Attendance from "../models/attendanceModel.js";
import AttendanceStatus from "../models/attendanceStatusModel.js";

const getAttendanceStatus = async (code) => {
  return await AttendanceStatus.findOne({
    code,
    isActive: true,
  });
};

export const createAttendance = async (employee, date, statusCode) => {
  const attendanceStatus = await getAttendanceStatus(statusCode);

  if (!attendanceStatus) {
    throw new Error(`${statusCode} attendance status not found.`);
  }

  return await Attendance.create({
    employee: employee._id,
    attendanceDate: date,

    attendanceStatus: attendanceStatus._id,

    shift: employee.shift?._id || null,

    totalHours: 0,
    lateMinutes: 0,
    overtimeHours: 0,

    checkInTime: null,
    checkOutTime: null,

    isActive: true,
  });
};
