import SalaryComponent from "../models/salaryComponentModel.js";

export const createSalaryComponentService = async (data, userId) => {
  const existingSalaryComponent = await SalaryComponent.findOne({
    code: data.code.toUpperCase(),
    isActive: true,
  });

  if (existingSalaryComponent) {
    throw new Error("Salary component already exists.");
  }

  return await SalaryComponent.create({
    ...data,
    code: data.code.toUpperCase(),
    createdBy: userId,
    updatedBy: userId,
  });
};

export const getSalaryComponentsService = async () => {
  return await SalaryComponent.find({
    isActive: true,
  }).sort({ createdAt: -1 });
};

export const getSalaryComponentByIdService = async (id) => {
  const salaryComponent = await SalaryComponent.findOne({
    _id: id,
    isActive: true,
  });

  if (!salaryComponent) {
    throw new Error("Salary component not found.");
  }

  return salaryComponent;
};

export const updateSalaryComponentService = async (id, data, userId) => {
  const salaryComponent = await SalaryComponent.findOne({
    _id: id,
    isActive: true,
  });

  if (!salaryComponent) {
    throw new Error("Salary component not found.");
  }

  const existingSalaryComponent = await SalaryComponent.findOne({
    _id: { $ne: id },
    code: data.code.toUpperCase(),
    isActive: true,
  });

  if (existingSalaryComponent) {
    throw new Error("Salary component already exists.");
  }

  Object.assign(salaryComponent, {
    ...data,
    code: data.code.toUpperCase(),
    updatedBy: userId,
  });

  await salaryComponent.save();

  return salaryComponent;
};

export const deleteSalaryComponentService = async (id, userId) => {
  const salaryComponent = await SalaryComponent.findOne({
    _id: id,
    isActive: true,
  });

  if (!salaryComponent) {
    throw new Error("Salary component not found.");
  }

  salaryComponent.isActive = false;
  salaryComponent.updatedBy = userId;

  await salaryComponent.save();

  return true;
};
