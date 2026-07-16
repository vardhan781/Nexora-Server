import Attendance from "../models/attendanceModel.js";
import Holiday from "../models/holidayModel.js";
import LeaveRequest from "../models/leaveRequestModel.js";
import RequestStatus from "../models/requestStatusModel.js";
import { createAttendance } from "./createAttendance.js";

export const processEmployeeAttendance = async (employee, date) => {
  const existingAttendance = await Attendance.findOne({
    employee: employee._id,
    attendanceDate: date,
    isActive: true,
  });

  if (existingAttendance) {
    return null;
  }

  const holiday = await Holiday.findOne({
    holidayDate: date,
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
    fromDate: { $lte: date },
    toDate: { $gte: date },
    isActive: true,
  });

  if (leaveRequest) {
    await createAttendance(employee, date, "LEAVE");
    return "leave";
  }

  await createAttendance(employee, date, "ABSENT");
  return "absent";
};
