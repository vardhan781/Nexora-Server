import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService.js";

export const createEmployeeController = async (req, res) => {
  try {
    const employee = await createEmployee(req.body, req.file, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeesController = async (req, res) => {
  try {
    const employees = await getEmployees();

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployeeController = async (req, res) => {
  try {
    const employee = await updateEmployee(
      req.params.id,
      req.body,
      req.file,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployeeController = async (req, res) => {
  try {
    await deleteEmployee(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
