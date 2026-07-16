import LeaveType from "../models/leaveTypeModel.js";

export const getLeaveTypeService = async () => {
  return await LeaveType.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createLeaveTypeService = async (data, userId) => {
  const { name, code, description } = data;

  const existingLeaveType = await LeaveType.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingLeaveType) {
    throw new Error("Leave type or code already exists");
  }

  const leaveType = await LeaveType.create({
    name,
    code,
    description,
    createdBy: userId,
  });

  return leaveType;
};

export const updateLeaveTypeService = async (leaveTypeId, data, userId) => {
  const { name, code, description } = data;

  const leaveType = await LeaveType.findOne({
    _id: leaveTypeId,
    isActive: true,
  });

  if (!leaveType) {
    throw new Error("Leave type not found");
  }

  const existingLeaveType = await LeaveType.findOne({
    _id: { $ne: leaveTypeId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingLeaveType) {
    throw new Error("Leave type or code already exists");
  }

  leaveType.name = name;
  leaveType.code = code.toUpperCase();
  leaveType.description = description;
  leaveType.updatedBy = userId;

  await leaveType.save();

  return leaveType;
};

export const deleteLeaveTypeService = async (leaveTypeId, userId) => {
  const leaveType = await LeaveType.findOne({
    _id: leaveTypeId,
    isActive: true,
  });

  if (!leaveType) {
    throw new Error("Leave type not found");
  }

  leaveType.isActive = false;
  leaveType.updatedBy = userId;

  await leaveType.save();

  return leaveType;
};
