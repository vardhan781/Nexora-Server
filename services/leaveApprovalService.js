import mongoose from "mongoose";
import LeaveRequest from "../models/leaveRequestModel.js";
import LeaveBalance from "../models/leaveBalanceModel.js";
import RequestStatus from "../models/requestStatusModel.js";
import Employee from "../models/employeeModel.js";

export const getPendingLeaveRequestsService = async (userId) => {
  const manager = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!manager) {
    throw new Error("Employee not found.");
  }

  const employees = await Employee.find({
    reportingManager: manager._id,
    isActive: true,
  }).select("_id");

  const employeeIds = employees.map((employee) => employee._id);

  const pendingStatus = await RequestStatus.findOne({
    code: "PENDING",
    isActive: true,
  });

  if (!pendingStatus) {
    throw new Error("Pending status not found.");
  }

  return await LeaveRequest.find({
    employee: { $in: employeeIds },
    requestStatus: pendingStatus._id,
    isActive: true,
  })
    .populate("employee")
    .populate("leaveType")
    .populate("requestStatus")
    .sort({ createdAt: -1 });
};

export const approveLeaveRequestService = async (
  leaveRequestId,
  remarks,
  userId,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const manager = await Employee.findOne({
      user: userId,
      isActive: true,
    }).session(session);

    if (!manager) {
      throw new Error("Employee not found.");
    }

    const request = await LeaveRequest.findOne({
      _id: leaveRequestId,
      isActive: true,
    })
      .populate("requestStatus")
      .session(session);

    if (!request) {
      throw new Error("Leave request not found.");
    }

    const employee = await Employee.findOne({
      _id: request.employee,
      reportingManager: manager._id,
      isActive: true,
    }).session(session);

    if (!employee) {
      throw new Error("You are not allowed to approve this leave request.");
    }

    if (request.requestStatus.code !== "PENDING") {
      throw new Error("Only pending requests can be approved.");
    }

    const approvedStatus = await RequestStatus.findOne({
      code: "APPROVED",
      isActive: true,
    }).session(session);

    if (!approvedStatus) {
      throw new Error("Approved status not found.");
    }

    const year = new Date(request.fromDate).getFullYear();

    const leaveBalance = await LeaveBalance.findOne({
      employee: request.employee,
      leaveType: request.leaveType,
      year,
      isActive: true,
    }).session(session);

    if (!leaveBalance) {
      throw new Error("Leave balance not found.");
    }

    const availableDays = leaveBalance.allocatedDays - leaveBalance.usedDays;

    if (availableDays < request.totalDays) {
      throw new Error("Insufficient leave balance.");
    }

    leaveBalance.usedDays += request.totalDays;
    leaveBalance.updatedBy = userId;

    await leaveBalance.save({ session });

    request.requestStatus = approvedStatus._id;
    request.approvedBy = manager._id;
    request.approvedAt = new Date();
    request.approvalRemarks = remarks || "";
    request.updatedBy = userId;

    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    return request;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const rejectLeaveRequestService = async (
  leaveRequestId,
  remarks,
  userId,
) => {
  const manager = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!manager) {
    throw new Error("Employee not found.");
  }

  const request = await LeaveRequest.findOne({
    _id: leaveRequestId,
    isActive: true,
  }).populate("requestStatus");

  if (!request) {
    throw new Error("Leave request not found.");
  }

  const employee = await Employee.findOne({
    _id: request.employee,
    reportingManager: manager._id,
    isActive: true,
  });

  if (!employee) {
    throw new Error("You are not allowed to reject this leave request.");
  }

  if (request.requestStatus.code !== "PENDING") {
    throw new Error("Only pending requests can be rejected.");
  }

  const rejectedStatus = await RequestStatus.findOne({
    code: "REJECTED",
    isActive: true,
  });

  if (!rejectedStatus) {
    throw new Error("Rejected status not found.");
  }

  request.requestStatus = rejectedStatus._id;
  request.approvedBy = manager._id;
  request.approvedAt = new Date();
  request.approvalRemarks = remarks || "";
  request.updatedBy = userId;

  await request.save();

  return request;
};
