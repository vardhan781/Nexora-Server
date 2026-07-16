import {
  createEmployeeTypeService,
  deleteEmployeeTypeService,
  getEmployeeTypesService,
  updateEmployeeTypeService,
} from "../services/employeeTypeService.js";

export const getEmployeeTypes = async (req, res) => {
  try {
    const employeeTypes = await getEmployeeTypesService();

    res.status(200).json({
      success: true,
      data: employeeTypes,
      message: "Employee types fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createEmployeeType = async (req, res) => {
  try {
    const employeeType = await createEmployeeTypeService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: employeeType,
      message: "Employee type created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployeeType = async (req, res) => {
  try {
    const employeeType = await updateEmployeeTypeService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: employeeType,
      message: "Employee type updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployeeType = async (req, res) => {
  try {
    await deleteEmployeeTypeService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Employee type deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
