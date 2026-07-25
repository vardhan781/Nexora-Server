import Attendance from "../models/attendanceModel.js";
import AttendanceStatus from "../models/attendanceStatusModel.js";
import Employee from "../models/employeeModel.js";
import Holiday from "../models/holidayModel.js";
import Shift from "../models/shiftModel.js";
import {
  attendanceDate,
  differenceInHours,
  differenceInMinutes,
  endOfToday,
  graceEnd,
  nowDate,
  shiftStart,
  startOfToday,
  getMonthStart,
  getMonthEnd,
  startOfGivenDay,
  toBusinessDateKey,
} from "../utils/dateUtils.js";
import { processEmployeeAttendance } from "../utils/processEmployeeAttendance.js";

export const clockInService = async (userId) => {
  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  }).populate("shift");

  if (!employee) {
    throw new Error("Employee not found.");
  }

  if (!employee.shift) {
    throw new Error("Shift is not assigned.");
  }

  const now = nowDate();

  const earliestCheckIn = shiftStart(employee.shift.startTime);
  earliestCheckIn.setMinutes(earliestCheckIn.getMinutes() - 45);

  if (now < earliestCheckIn) {
    throw new Error(
      `You can clock in only 45 minutes before your shift starts.`,
    );
  }

  const today = attendanceDate();

  const presentStatus = await AttendanceStatus.findOne({
    code: "PRESENT",
    isActive: true,
  });

  const absentStatus = await AttendanceStatus.findOne({
    code: "ABSENT",
    isActive: true,
  });

  if (!presentStatus) {
    throw new Error("Present status not found.");
  }

  const graceEndTime = graceEnd(
    employee.shift.startTime,
    employee.shift.graceMinutes,
  );

  let lateMinutes = 0;

  if (now > graceEndTime) {
    lateMinutes = differenceInMinutes(now, graceEndTime);
  }

  const startOfDay = startOfToday();

  const endOfDay = endOfToday();

  const existingAttendance = await Attendance.findOne({
    employee: employee._id,
    attendanceDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  }).populate("attendanceStatus");

  if (
    existingAttendance &&
    existingAttendance.attendanceStatus.code === "ABSENT"
  ) {
    existingAttendance.checkInTime = now;
    existingAttendance.attendanceStatus = presentStatus._id;

    existingAttendance.lateMinutes = lateMinutes;

    existingAttendance.shift = employee.shift._id;

    existingAttendance.updatedBy = userId;

    await existingAttendance.save();

    return existingAttendance;
  }

  if (existingAttendance) {
    throw new Error("You have already clocked in today.");
  }

  const attendance = await Attendance.create({
    employee: employee._id,

    attendanceDate: today,

    checkInTime: now,

    attendanceStatus: presentStatus._id,

    lateMinutes,

    shift: employee.shift._id,

    createdBy: userId,

    updatedBy: userId,
  });

  return attendance;
};

export const clockOutService = async (userId) => {
  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  }).populate("shift");

  if (!employee) {
    throw new Error("Employee not found.");
  }

  if (!employee.shift) {
    throw new Error("Shift is not assigned.");
  }

  const now = nowDate();

  const today = attendanceDate();

  const startOfDay = startOfToday();

  const endOfDay = endOfToday();

  const attendance = await Attendance.findOne({
    employee: employee._id,
    attendanceDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  }).populate("attendanceStatus");

  if (!attendance) {
    throw new Error("Please clock in first.");
  }

  if (attendance.checkOutTime) {
    throw new Error("You have already clocked out today.");
  }

  const totalHours = differenceInHours(now, attendance.checkInTime);

  let overtimeHours = 0;

  if (totalHours > employee.shift.totalHours) {
    overtimeHours = Number((totalHours - employee.shift.totalHours).toFixed(2));
  }

  const [presentStatus, halfDayStatus, absentStatus] = await Promise.all([
    AttendanceStatus.findOne({
      code: "PRESENT",
      isActive: true,
    }),
    AttendanceStatus.findOne({
      code: "HALF_DAY",
      isActive: true,
    }),
    AttendanceStatus.findOne({
      code: "ABSENT",
      isActive: true,
    }),
  ]);

  if (!presentStatus) {
    throw new Error("Present attendance status not found.");
  }

  if (!halfDayStatus) {
    throw new Error("Half day attendance status not found.");
  }

  if (!absentStatus) {
    throw new Error("Absent attendance status not found.");
  }

  let attendanceStatus;

  if (attendance.lateMinutes >= 120) {
    attendanceStatus = halfDayStatus;
  } else if (totalHours >= employee.shift.totalHours) {
    attendanceStatus = presentStatus;
  } else if (totalHours >= employee.shift.halfDayHours) {
    attendanceStatus = halfDayStatus;
  } else {
    attendanceStatus = absentStatus;
  }

  attendance.checkOutTime = now;
  attendance.totalHours = totalHours;
  attendance.overtimeHours = overtimeHours;
  attendance.attendanceStatus = attendanceStatus._id;
  attendance.updatedBy = userId;

  await attendance.save();

  return attendance;
};

export const getTodayAttendanceService = async (userId) => {
  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  }).populate("shift");

  if (!employee) {
    throw new Error("Employee not found.");
  }

  if (!employee.shift) {
    throw new Error("Shift is not assigned.");
  }

  const today = attendanceDate();

  const startOfDay = startOfToday();

  const endOfDay = endOfToday();

  const attendance = await Attendance.findOne({
    employee: employee._id,
    attendanceDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  })
    .populate("attendanceStatus")
    .populate("shift");

  if (!attendance) {
    const now = nowDate();

    const earliestCheckIn = shiftStart(employee.shift.startTime);
    earliestCheckIn.setMinutes(earliestCheckIn.getMinutes() - 45);

    const canClockIn = now >= earliestCheckIn;

    return {
      attendanceDate: today,

      isClockedIn: false,
      isClockedOut: false,

      canClockIn,
      canClockOut: false,

      attendanceStatus: null,

      shift: {
        name: employee.shift.name,
        startTime: employee.shift.startTime,
        endTime: employee.shift.endTime,
        graceMinutes: employee.shift.graceMinutes,
      },

      checkInTime: null,
      checkOutTime: null,

      lateMinutes: 0,
      isLate: false,

      totalHours: 0,
      requiredHours: employee.shift.totalHours,
      remainingHours: employee.shift.totalHours,
      workingProgress: 0,
      overtimeHours: 0,

      expectedCheckoutTime: employee.shift.endTime,
    };
  }

  return {
    attendanceDate: attendance.attendanceDate,

    isClockedIn: !!attendance.checkInTime,
    isClockedOut: !!attendance.checkOutTime,

    canClockIn: false,
    canClockOut: !attendance.checkOutTime,

    attendanceStatus: attendance.attendanceStatus,

    shift: {
      name: attendance.shift.name,
      startTime: attendance.shift.startTime,
      endTime: attendance.shift.endTime,
      graceMinutes: attendance.shift.graceMinutes,
    },

    checkInTime: attendance.checkInTime,
    checkOutTime: attendance.checkOutTime,

    lateMinutes: attendance.lateMinutes,
    isLate: attendance.lateMinutes > 0,

    totalHours: attendance.totalHours,
    requiredHours: attendance.shift.totalHours,
    remainingHours: Math.max(
      0,
      Number((attendance.shift.totalHours - attendance.totalHours).toFixed(2)),
    ),

    workingProgress: Number(
      Math.min(
        (attendance.totalHours / attendance.shift.totalHours) * 100,
        100,
      ).toFixed(2),
    ),

    overtimeHours: attendance.overtimeHours,

    expectedCheckoutTime: attendance.shift.endTime,
  };
};

export const getMonthlyAttendanceCalendarService = async (
  userId,
  month,
  year,
) => {
  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  }).populate("shift");

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const startDate = getMonthStart(month, year);
  const endDate = getMonthEnd(month, year);

  console.log("\n================ CALENDAR REQUEST ================");
  console.log("Month:", month);
  console.log("Year:", year);
  console.log("Start Date:", startDate.toISOString());
  console.log("End Date:", endDate.toISOString());
  console.log("Today:", attendanceDate().toISOString());
  console.log("==================================================\n");

  const [attendance, holidays, attendanceStatuses] = await Promise.all([
    Attendance.find({
      employee: employee._id,
      attendanceDate: {
        $gte: startDate,
        $lte: endDate,
      },
      isActive: true,
    })
      .populate("attendanceStatus")
      .sort({ attendanceDate: 1 }),

    Holiday.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      isActive: true,
    }),

    AttendanceStatus.find({
      isActive: true,
    }),
  ]);

  console.log("\n========== ATTENDANCE FROM DB ==========");

  attendance.forEach((item) => {
    console.log({
      attendanceDate: item.attendanceDate.toISOString(),
      businessKey: toBusinessDateKey(item.attendanceDate),
      status: item.attendanceStatus.code,
      checkIn: item.checkInTime,
      checkOut: item.checkOutTime,
    });
  });

  console.log("\n========== HOLIDAYS ==========");

  holidays.forEach((holiday) => {
    console.log({
      holiday: holiday.name,
      date: holiday.date.toISOString(),
      businessKey: toBusinessDateKey(holiday.date),
    });
  });

  const statusMap = new Map();

  attendanceStatuses.forEach((status) => {
    statusMap.set(status.code, status);
  });

  const holidayStatus = statusMap.get("HOLIDAY");
  const weeklyOffStatus = statusMap.get("WEEKLY_OFF");
  const absentStatus = statusMap.get("ABSENT");

  const attendanceMap = new Map();

  attendance.forEach((item) => {
    const key = toBusinessDateKey(item.attendanceDate);
    attendanceMap.set(key, item);
  });

  console.log("\n========== ATTENDANCE MAP ==========");

  for (const [key, value] of attendanceMap.entries()) {
    console.log(key, {
      attendanceDate: value.attendanceDate.toISOString(),
      status: value.attendanceStatus.code,
    });
  }

  const holidayMap = new Map();

  holidays.forEach((holiday) => {
    const key = toBusinessDateKey(holiday.date);
    holidayMap.set(key, holiday);
  });

  const weeklyOffDays = employee.shift?.weeklyOffDays || [];

  console.log("\nWeekly Off Days:", weeklyOffDays);

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const today = attendanceDate();

  const calendar = [];

  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    const currentDate = new Date(current);

    const key = toBusinessDateKey(currentDate);

    const attendanceRecord = attendanceMap.get(key);

    console.log("\n----------------------------------------");
    console.log("Current Date:", currentDate.toISOString());
    console.log("Business Key:", key);
    console.log("Day:", dayNames[currentDate.getDay()]);
    console.log("Attendance Exists:", attendanceMap.has(key));
    console.log("Holiday Exists:", holidayMap.has(key));
    console.log(
      "Weekly Off:",
      weeklyOffDays.includes(dayNames[currentDate.getDay()]),
    );

    if (attendanceRecord) {
      console.log(">>>> MATCHED ATTENDANCE <<<<");
      console.log({
        attendanceDate: attendanceRecord.attendanceDate.toISOString(),
        status: attendanceRecord.attendanceStatus.code,
      });

      calendar.push({
        date: attendanceRecord.attendanceDate,
        day: attendanceRecord.attendanceDate.getDate(),
        dayLabel: attendanceRecord.attendanceStatus.name,
        status: attendanceRecord.attendanceStatus.code,
        checkInTime: attendanceRecord.checkInTime,
        checkOutTime: attendanceRecord.checkOutTime,
        totalHours: attendanceRecord.totalHours,
        lateMinutes: attendanceRecord.lateMinutes,
        overtimeHours: attendanceRecord.overtimeHours,
      });

      continue;
    }

    if (holidayMap.has(key)) {
      console.log(">>>> SELECTED HOLIDAY <<<<");

      const holiday = holidayMap.get(key);

      calendar.push({
        date: currentDate,
        day: currentDate.getDate(),
        dayLabel: holidayStatus?.name || holiday.name,
        status: holidayStatus?.code || "HOLIDAY",
        holidayName: holiday.name,
        checkInTime: null,
        checkOutTime: null,
        totalHours: null,
        lateMinutes: null,
        overtimeHours: null,
      });

      continue;
    }

    const dayName = dayNames[currentDate.getDay()];

    if (weeklyOffDays.includes(dayName)) {
      console.log(">>>> SELECTED WEEKLY OFF <<<<");

      calendar.push({
        date: currentDate,
        day: currentDate.getDate(),
        dayLabel: weeklyOffStatus?.name || "Weekly Off",
        status: weeklyOffStatus?.code || "WEEKLY_OFF",
        checkInTime: null,
        checkOutTime: null,
        totalHours: null,
        lateMinutes: null,
        overtimeHours: null,
      });

      continue;
    }

    if (currentDate > today) {
      console.log(">>>> SELECTED UPCOMING <<<<");

      calendar.push({
        date: currentDate,
        day: currentDate.getDate(),
        dayLabel: "Upcoming",
        status: "UPCOMING",
        checkInTime: null,
        checkOutTime: null,
        totalHours: null,
        lateMinutes: null,
        overtimeHours: null,
      });

      continue;
    }

    console.log(">>>> SELECTED ABSENT <<<<");

    calendar.push({
      date: currentDate,
      day: currentDate.getDate(),
      dayLabel: absentStatus?.name || "Absent",
      status: absentStatus?.code || "ABSENT",
      checkInTime: null,
      checkOutTime: null,
      totalHours: null,
      lateMinutes: null,
      overtimeHours: null,
    });
  }

  console.log("\n================ CALENDAR RESULT ================");
  calendar.forEach((item) => {
    console.log({
      day: item.day,
      status: item.status,
      date: item.date.toISOString(),
    });
  });
  console.log("=================================================\n");

  return calendar;
};

export const runAttendanceSchedulerService = async (date = new Date()) => {
  date = startOfGivenDay(date);

  const today = attendanceDate();

  if (date > today) {
    throw new Error("Cannot generate attendance for future dates.");
  }

  const employees = await Employee.find({
    isActive: true,
  }).populate("shift");

  const summary = {
    processed: 0,
    skipped: 0,
    present: 0,
    halfDay: 0,
    absent: 0,
    leave: 0,
    holiday: 0,
    weekOff: 0,
  };

  for (const employee of employees) {
    const result = await processEmployeeAttendance(employee, date);

    summary.processed++;

    if (result) {
      summary[result]++;
    } else {
      summary.skipped++;
    }
  }

  return summary;
};
