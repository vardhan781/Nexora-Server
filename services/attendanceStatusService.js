import AttendanceStatus from "../models/attendanceStatusModel.js";

export const getAttendanceStatusService = async () => {
  return await AttendanceStatus.find({ isActive: true }).sort({
    createdAt: -1,
  });
};

export const createAttendanceStatusService = async (data, userId) => {
  const { name, code, description } = data;

  const exisitingAttendanceStatus = await AttendanceStatus.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (exisitingAttendanceStatus) {
    throw new Error("Attendance status name or code already exists");
  }

  const attendanceStatus = await AttendanceStatus.create({
    name,
    code: code.toUpperCase(),
    description,
    createdBy: userId,
  });

  return attendanceStatus;
};

export const updateAttendanceStatusService = async (
  attendanceStatusId,
  data,
  userId,
) => {
  const { name, code, description } = data;

  const attendanceStatus = await AttendanceStatus.findOne({
    _id: attendanceStatusId,
    isActive: true,
  });

  if (!attendanceStatus) {
    throw new Error("Attendance status not found");
  }

  const existingAttendanceStatus = await AttendanceStatus.findOne({
    _id: { $ne: attendanceStatusId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingAttendanceStatus) {
    throw new Error("Attendance status name or code already exists");
  }

  attendanceStatus.name = name;
  attendanceStatus.code = code.toUpperCase();
  attendanceStatus.description = description;
  attendanceStatus.updatedBy = userId;

  await attendanceStatus.save();

  return attendanceStatus;
};

export const deleteAttendanceStatusService = async (
  attendanceStatusId,
  userId,
) => {
  const attendanceStatus = await AttendanceStatus.findOne({
    _id: attendanceStatusId,
    isActive: true,
  });

  if (!attendanceStatus) {
    throw new Error("Attendance status not found");
  }

  attendanceStatus.isActive = false;
  attendanceStatus.updatedBy = userId;

  await attendanceStatus.save();

  return attendanceStatus;
};
