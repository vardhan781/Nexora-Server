import Shift from "../models/shiftModel.js";

export const getShiftsService = async () => {
  return await Shift.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createShiftService = async (data, userId) => {
  const {
    name,
    code,
    startTime,
    endTime,
    totalHours,
    graceMinutes,
    halfDayHours,
    weeklyOffDays,
    isNightShift,
  } = data;

  const existingShift = await Shift.findOne({
    isActive: true,
    code: code.trim().toUpperCase(),
  });

  if (existingShift) {
    throw new Error("Shift code already exists");
  }

  const shift = await Shift.create({
    name,
    code: code.trim().toUpperCase(),
    startTime,
    endTime,
    totalHours,
    graceMinutes,
    halfDayHours,
    weeklyOffDays,
    createdBy: userId,
    isNightShift,
  });

  return shift;
};

export const updateShiftService = async (shiftId, data, userId) => {
  const shift = await Shift.findOne({
    _id: shiftId,
    isActive: true,
  });

  if (!shift) {
    throw new Error("Shift not found");
  }

  const {
    name,
    code,
    startTime,
    endTime,
    totalHours,
    graceMinutes,
    halfDayHours,
    weeklyOffDays,
    isNightShift,
  } = data;

  if (code) {
    const existingShift = await Shift.findOne({
      _id: { $ne: shiftId },
      isActive: true,
      code: code.trim().toUpperCase(),
    });

    if (existingShift) {
      throw new Error("Shift code already exists");
    }

    shift.code = code.trim().toUpperCase();
  }

  if (name) shift.name = name;
  if (startTime) shift.startTime = startTime;
  if (endTime) shift.endTime = endTime;
  if (totalHours !== undefined) shift.totalHours = totalHours;
  if (graceMinutes !== undefined) shift.graceMinutes = graceMinutes;
  if (halfDayHours !== undefined) shift.halfDayHours = halfDayHours;
  if (weeklyOffDays !== undefined) shift.weeklyOffDays = weeklyOffDays;
  if (isNightShift !== undefined) shift.isNightShift = isNightShift;

  shift.updatedBy = userId;

  await shift.save();

  return shift;
};

export const deleteShiftService = async (shiftId, userId) => {
  const shift = await Shift.findOne({
    _id: shiftId,
    isActive: true,
  });

  if (!shift) {
    throw new Error("Shift not found");
  }

  shift.isActive = false;
  shift.updatedBy = userId;

  await shift.save();

  return shift;
};
