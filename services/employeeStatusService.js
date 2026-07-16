import EmployeeStatus from "../models/employeeStatusModel.js";

export const getEmployeeStatusesService = async () => {
  return await EmployeeStatus.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createEmployeeStatusService = async (data, userId) => {
  const { name, code, description } = data;

  const existingEmployeeStatus = await EmployeeStatus.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingEmployeeStatus) {
    throw new Error("Employee status name or code already exists");
  }

  const employeeStatus = await EmployeeStatus.create({
    name,
    code,
    description,
    createdBy: userId,
  });

  return employeeStatus;
};

export const updateEmployeeStatusService = async (
  employeeStatusId,
  data,
  userId,
) => {
  const { name, code, description } = data;

  const employeeStatus = await EmployeeStatus.findOne({
    _id: employeeStatusId,
    isActive: true,
  });

  if (!employeeStatus) {
    throw new Error("Employee status not found");
  }

  const existingEmployeeStatus = await EmployeeStatus.findOne({
    _id: { $ne: employeeStatusId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingEmployeeStatus) {
    throw new Error("Employee status name or code already exists");
  }

  employeeStatus.name = name;
  employeeStatus.code = code.toUpperCase();
  employeeStatus.description = description;
  employeeStatus.updatedBy = userId;

  await employeeStatus.save();

  return employeeStatus;
};

export const deleteEmployeeStatusService = async (employeeStatusId, userId) => {
  const employeeStatus = await EmployeeStatus.findOne({
    _id: employeeStatusId,
    isActive: true,
  });

  if (!employeeStatus) {
    throw new Error("Employee status not found");
  }

  employeeStatus.isActive = false;
  employeeStatus.updatedBy = userId;

  await employeeStatus.save();

  return employeeStatus;
};
