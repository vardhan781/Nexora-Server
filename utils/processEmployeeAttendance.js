import Attendance from "../models/attendanceModel.js";
import Holiday from "../models/holidayModel.js";
import LeaveRequest from "../models/leaveRequestModel.js";
import RequestStatus from "../models/requestStatusModel.js";
import { createAttendance } from "./createAttendance.js";

export const processEmployeeAttendance = async (employee, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAttendance = await Attendance.findOne({
    employee: employee._id,
    attendanceDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  });

  if (existingAttendance) {
    return null;
  }

  const holiday = await Holiday.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  });

  if (holiday) {
    await createAttendance(employee, date, "HOLIDAY");
    return "holiday";
  }

  const dayCode = date
    .toLocaleDateString("en-US", {
      weekday: "short",
    })
    .toUpperCase();

  if (employee.shift?.weeklyOffDays.includes(dayCode)) {
    await createAttendance(employee, date, "WEEKLY_OFF");
    return "weekOff";
  }

  const approvedStatus = await RequestStatus.findOne({
    code: "APPROVED",
    isActive: true,
  });

  const leaveRequest = await LeaveRequest.findOne({
    employee: employee._id,
    requestStatus: approvedStatus?._id,
    fromDate: { $lte: endOfDay },
    toDate: { $gte: startOfDay },
    isActive: true,
  });

  if (leaveRequest) {
    await createAttendance(employee, date, "LEAVE");
    return "leave";
  }

  await createAttendance(employee, date, "ABSENT");
  return "absent";
};
