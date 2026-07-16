import {
  createLeaveRequestService,
  getMyLeaveRequestsService,
  updateLeaveRequestService,
  deleteLeaveRequestService,
} from "../services/leaveRequestService.js";

export const getMyLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await getMyLeaveRequestsService(req.user._id);

    res.status(200).json({
      success: true,
      data: leaveRequests,
      message: "Leave requests fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await createLeaveRequestService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: leaveRequest,
      message: "Leave request created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await updateLeaveRequestService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: "Leave request updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    await deleteLeaveRequestService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Leave request deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
