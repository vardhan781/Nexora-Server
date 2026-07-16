import {
  createEmployeeStatusService,
  deleteEmployeeStatusService,
  getEmployeeStatusesService,
  updateEmployeeStatusService,
} from "../services/employeeStatusService.js";

export const getEmployeeStatuses = async (req, res) => {
  try {
    const employeeStatuses = await getEmployeeStatusesService();

    res.status(200).json({
      success: true,
      data: employeeStatuses,
      message: "Employee statuses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createEmployeeStatus = async (req, res) => {
  try {
    const employeeStatus = await createEmployeeStatusService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: employeeStatus,
      message: "Employee status created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployeeStatus = async (req, res) => {
  try {
    const employeeStatus = await updateEmployeeStatusService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: employeeStatus,
      message: "Employee status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployeeStatus = async (req, res) => {
  try {
    await deleteEmployeeStatusService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Employee status deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
