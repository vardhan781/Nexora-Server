import Department from "../models/departmentModel.js";

export const getDepartmentsService = async () => {
  return await Department.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createDepartmentService = async (data, userId) => {
  const { name, code, description } = data;

  const existingDepartment = await Department.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingDepartment) {
    throw new Error("Department name or code already exists");
  }

  const department = await Department.create({
    name,
    code,
    description,
    createdBy: userId,
  });

  return department;
};

export const updateDepartmentService = async (departmentId, data, userId) => {
  const { name, code, description } = data;

  const department = await Department.findOne({
    _id: departmentId,
    isActive: true,
  });

  if (!department) {
    throw new Error("Department not found");
  }

  const existingDepartment = await Department.findOne({
    _id: { $ne: departmentId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingDepartment) {
    throw new Error("Department name or code already exists");
  }

  department.name = name;
  department.code = code.toUpperCase();
  department.description = description;
  department.updatedBy = userId;

  await department.save();

  return department;
};

export const deleteDepartmentService = async (departmentId, userId) => {
  const department = await Department.findOne({
    _id: departmentId,
    isActive: true,
  });

  if (!department) {
    throw new Error("Department not found");
  }

  department.isActive = false;
  department.updatedBy = userId;

  await department.save();

  return department;
};
