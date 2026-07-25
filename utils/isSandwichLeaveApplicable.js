import Holiday from "../models/holidayModel.js";
import LeaveRequest from "../models/leaveRequestModel.js";
import RequestStatus from "../models/requestStatusModel.js";
import { startOfGivenDay, endOfGivenDay, getWeekdayCode } from "./dateUtils.js";

const isHoliday = (holidayMap, date) => {
  const key = startOfGivenDay(date).toISOString();

  return holidayMap.has(key);
};

const isWeeklyOff = (employee, date) => {
  const dayCode = getWeekdayCode(date);

  return employee.shift?.weeklyOffDays.includes(dayCode);
};

const isNonWorkingDay = (employee, holidayMap, date) => {
  return isHoliday(holidayMap, date) || isWeeklyOff(employee, date);
};

const hasApprovedLeave = async (employeeId, date, approvedStatusId) => {
  const start = startOfGivenDay(date);
  const end = endOfGivenDay(date);

  return await LeaveRequest.exists({
    employee: employeeId,
    requestStatus: approvedStatusId,
    fromDate: { $lte: end },
    toDate: { $gte: start },
    isActive: true,
  });
};

export const isSandwichLeaveApplicable = async (employee, date) => {
  const start = startOfGivenDay(date);
  const end = endOfGivenDay(date);

  const holidays = await Holiday.find({
    date: {
      $gte: startOfGivenDay(new Date(date.getFullYear(), 0, 1)),
      $lte: endOfGivenDay(new Date(date.getFullYear(), 11, 31)),
    },
    isActive: true,
  });

  const holidayMap = new Map();

  holidays.forEach((holiday) => {
    holidayMap.set(startOfGivenDay(holiday.date).toISOString(), true);
  });

  if (!isNonWorkingDay(employee, holidayMap, date)) {
    return false;
  }

  const approvedStatus = await RequestStatus.findOne({
    code: "APPROVED",
    isActive: true,
  });

  if (!approvedStatus) {
    return false;
  }

  let previousDay = new Date(date);

  previousDay.setDate(previousDay.getDate() - 1);

  while (isNonWorkingDay(employee, holidayMap, previousDay)) {
    previousDay.setDate(previousDay.getDate() - 1);
  }

  let nextDay = new Date(date);

  nextDay.setDate(nextDay.getDate() + 1);

  while (isNonWorkingDay(employee, holidayMap, nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  const leaveBefore = await hasApprovedLeave(
    employee._id,
    previousDay,
    approvedStatus._id,
  );

  if (!leaveBefore) {
    return false;
  }

  const leaveAfter = await hasApprovedLeave(
    employee._id,
    nextDay,
    approvedStatus._id,
  );

  if (!leaveAfter) {
    return false;
  }

  return true;
};
