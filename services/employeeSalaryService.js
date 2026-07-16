import EmployeeSalary from "../models/employeeSalaryModel.js";
import Employee from "../models/employeeModel.js";
import SalaryComponent from "../models/salaryComponentModel.js";

export const createEmployeeSalaryService = async (data, userId) => {
  const employee = await Employee.findOne({
    _id: data.employee,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const existingSalary = await EmployeeSalary.findOne({
    employee: data.employee,
    effectiveFrom: data.effectiveFrom,
    isActive: true,
  });

  if (existingSalary) {
    throw new Error(
      "Salary already exists for this employee on the selected effective date.",
    );
  }

  if (!data.salaryStructure?.length) {
    throw new Error("Salary structure is required.");
  }

  if (data.grossSalary < 0) {
    throw new Error("Gross salary cannot be negative.");
  }

  if (data.ctc < data.grossSalary) {
    throw new Error("CTC cannot be less than Gross Salary.");
  }

  for (const component of data.salaryStructure) {
    const salaryComponent = await SalaryComponent.findOne({
      _id: component.salaryComponent,
      isActive: true,
    });

    if (!salaryComponent) {
      throw new Error("One or more salary components are invalid.");
    }
  }

  return await EmployeeSalary.create({
    ...data,
    createdBy: userId,
    updatedBy: userId,
  });
};

export const getEmployeeSalaryListService = async () => {
  return await EmployeeSalary.find({
    isActive: true,
  })
    .populate("employee")
    .populate("salaryStructure.salaryComponent")
    .sort({
      effectiveFrom: -1,
    });
};

export const getEmployeeSalaryByIdService = async (id) => {
  const salary = await EmployeeSalary.findOne({
    _id: id,
    isActive: true,
  })
    .populate("employee")
    .populate("salaryStructure.salaryComponent");

  if (!salary) {
    throw new Error("Employee salary not found.");
  }

  return salary;
};

export const updateEmployeeSalaryService = async (id, data, userId) => {
  const salary = await EmployeeSalary.findOne({
    _id: id,
    isActive: true,
  });

  if (!salary) {
    throw new Error("Employee salary not found.");
  }

  if (!data.salaryStructure?.length) {
    throw new Error("Salary structure is required.");
  }

  if (data.grossSalary < 0) {
    throw new Error("Gross salary cannot be negative.");
  }

  if (data.ctc < data.grossSalary) {
    throw new Error("CTC cannot be less than Gross Salary.");
  }

  const duplicateSalary = await EmployeeSalary.findOne({
    employee: data.employee,
    effectiveFrom: data.effectiveFrom,
    isActive: true,
    _id: { $ne: id },
  });

  if (duplicateSalary) {
    throw new Error(
      "Salary already exists for this employee on the selected effective date.",
    );
  }

  for (const component of data.salaryStructure) {
    const salaryComponent = await SalaryComponent.findOne({
      _id: component.salaryComponent,
      isActive: true,
    });

    if (!salaryComponent) {
      throw new Error("One or more salary components are invalid.");
    }
  }

  Object.assign(salary, {
    ...data,
    updatedBy: userId,
  });

  await salary.save();

  return salary;
};

export const deleteEmployeeSalaryService = async (id, userId) => {
  const salary = await EmployeeSalary.findOne({
    _id: id,
    isActive: true,
  });

  if (!salary) {
    throw new Error("Employee salary not found.");
  }

  salary.isActive = false;
  salary.updatedBy = userId;

  await salary.save();

  return true;
};

export const getEmployeeSalaryHistoryService = async (employeeId) => {
  const employee = await Employee.findOne({
    _id: employeeId,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  return await EmployeeSalary.find({
    employee: employeeId,
    isActive: true,
  })
    .populate("salaryStructure.salaryComponent")
    .sort({
      effectiveFrom: -1,
    });
};
