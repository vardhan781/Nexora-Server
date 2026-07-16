import {
  createLeaveTypeService,
  getLeaveTypeService,
  deleteLeaveTypeService,
  updateLeaveTypeService,
} from "../services/leaveTypeService.js";

export const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await getLeaveTypeService();

    res.status(200).json({
      success: true,
      data: leaveTypes,
      message: "Leave types fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLeaveType = async (req, res) => {
  try {
    const leaveType = await createLeaveTypeService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      data: leaveType,
      message: "Leave type created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeaveType = async (req, res) => {
  try {
    const leaveType = await updateLeaveTypeService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: leaveType,
      message: "Leave type updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeaveType = async (req, res) => {
  try {
    await deleteLeaveTypeService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Leave type deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
