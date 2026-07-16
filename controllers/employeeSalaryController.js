import {
  createEmployeeSalaryService,
  getEmployeeSalaryListService,
  getEmployeeSalaryByIdService,
  updateEmployeeSalaryService,
  deleteEmployeeSalaryService,
  getEmployeeSalaryHistoryService,
} from "../services/employeeSalaryService.js";

export const getEmployeeSalaryList = async (req, res) => {
  try {
    const employeeSalaries = await getEmployeeSalaryListService();

    res.status(200).json({
      success: true,
      data: employeeSalaries,
      message: "Employee salaries fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeeSalaryById = async (req, res) => {
  try {
    const employeeSalary = await getEmployeeSalaryByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: employeeSalary,
      message: "Employee salary fetched successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeeSalaryHistory = async (req, res) => {
  try {
    const salaryHistory = await getEmployeeSalaryHistoryService(
      req.params.employeeId,
    );

    res.status(200).json({
      success: true,
      data: salaryHistory,
      message: "Employee salary history fetched successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const createEmployeeSalary = async (req, res) => {
  try {
    const employeeSalary = await createEmployeeSalaryService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: employeeSalary,
      message: "Employee salary created successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployeeSalary = async (req, res) => {
  try {
    const employeeSalary = await updateEmployeeSalaryService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: employeeSalary,
      message: "Employee salary updated successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployeeSalary = async (req, res) => {
  try {
    await deleteEmployeeSalaryService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Employee salary deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
