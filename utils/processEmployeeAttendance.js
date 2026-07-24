import Attendance from "../models/attendanceModel.js";
import AttendanceStatus from "../models/attendanceStatusModel.js";
import Holiday from "../models/holidayModel.js";
import LeaveRequest from "../models/leaveRequestModel.js";
import RequestStatus from "../models/requestStatusModel.js";
import { createAttendance } from "./createAttendance.js";
import { endOfGivenDay, getWeekdayCode, startOfGivenDay } from "./dateUtils.js";

export const processEmployeeAttendance = async (employee, date) => {
  const startOfDay = startOfGivenDay(date);

  const endOfDay = endOfGivenDay(date);

  const existingAttendance = await Attendance.findOne({
    employee: employee._id,
    attendanceDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  });

  if (existingAttendance) {
    if (existingAttendance.checkInTime && !existingAttendance.checkOutTime) {
      const checkOutTime = new Date(existingAttendance.checkInTime);

      checkOutTime.setHours(
        checkOutTime.getHours() + employee.shift.totalHours,
      );

      existingAttendance.checkOutTime = checkOutTime;

      existingAttendance.totalHours = employee.shift.totalHours;

      existingAttendance.overtimeHours = 0;

      const [presentStatus, halfDayStatus] = await Promise.all([
        AttendanceStatus.findOne({
          code: "PRESENT",
          isActive: true,
        }),
        AttendanceStatus.findOne({
          code: "HALF_DAY",
          isActive: true,
        }),
      ]);

      if (existingAttendance.lateMinutes >= 120) {
        existingAttendance.attendanceStatus = halfDayStatus._id;
      } else {
        existingAttendance.attendanceStatus = presentStatus._id;
      }

      await existingAttendance.save();
    }

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

  const dayCode = getWeekdayCode(date);

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
