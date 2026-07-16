import EmployeeType from "../models/employeeTypeModel.js";

export const getEmployeeTypesService = async () => {
  return await EmployeeType.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createEmployeeTypeService = async (data, userId) => {
  const { name, code, description } = data;

  const existingEmployeeType = await EmployeeType.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingEmployeeType) {
    throw new Error("Employee type name or code already exists");
  }

  const employeeType = await EmployeeType.create({
    name,
    code,
    description,
    createdBy: userId,
  });

  return employeeType;
};

export const updateEmployeeTypeService = async (
  employeeTypeId,
  data,
  userId,
) => {
  const { name, code, description } = data;

  const employeeType = await EmployeeType.findOne({
    _id: employeeTypeId,
    isActive: true,
  });

  if (!employeeType) {
    throw new Error("Employee type not found");
  }

  const existingEmployeeType = await EmployeeType.findOne({
    _id: { $ne: employeeTypeId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingEmployeeType) {
    throw new Error("Employee type name or code already exists");
  }

  employeeType.name = name;
  employeeType.code = code.toUpperCase();
  employeeType.description = description;
  employeeType.updatedBy = userId;

  await employeeType.save();

  return employeeType;
};

export const deleteEmployeeTypeService = async (employeeTypeId, userId) => {
  const employeeType = await EmployeeType.findOne({
    _id: employeeTypeId,
    isActive: true,
  });

  if (!employeeType) {
    throw new Error("Employee type not found");
  }

  employeeType.isActive = false;
  employeeType.updatedBy = userId;

  await employeeType.save();

  return employeeType;
};
