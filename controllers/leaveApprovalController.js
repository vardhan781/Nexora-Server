import {
  getPendingLeaveRequestsService,
  approveLeaveRequestService,
  rejectLeaveRequestService,
} from "../services/leaveApprovalService.js";

export const getPendingLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await getPendingLeaveRequestsService(req.user._id);

    res.status(200).json({
      success: true,
      data: leaveRequests,
      message: "Pending leave requests fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await approveLeaveRequestService(
      req.params.id,
      req.body.remarks,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: "Leave request approved successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await rejectLeaveRequestService(
      req.params.id,
      req.body.remarks,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: "Leave request rejected successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
