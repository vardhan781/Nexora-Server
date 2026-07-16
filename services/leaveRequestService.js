import LeaveRequest from "../models/leaveRequestModel.js";
import LeaveType from "../models/leaveTypeModel.js";
import RequestStatus from "../models/requestStatusModel.js";
import Employee from "../models/employeeModel.js";

export const createLeaveRequestService = async (data, userId) => {
  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found for this user.");
  }

  const leaveType = await LeaveType.findOne({
    _id: data.leaveType,
    isActive: true,
  });

  if (!leaveType) {
    throw new Error("Leave type not found.");
  }

  const pendingStatus = await RequestStatus.findOne({
    code: "PENDING",
    isActive: true,
  });

  if (!pendingStatus) {
    throw new Error("Request status not found.");
  }

  return await LeaveRequest.create({
    ...data,
    employee: employee._id,
    requestStatus: pendingStatus._id,
    createdBy: userId,
    updatedBy: userId,
  });
};

export const getMyLeaveRequestsService = async (userId) => {
  const employee = await Employee.findOne({ user: userId });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const requests = await LeaveRequest.find({
    employee: employee._id,
    isActive: true,
  })
    .populate("leaveType")
    .populate("requestStatus")
    .sort({ createdAt: -1 });

  return requests.map((request) => {
    const obj = request.toObject();
    const isPending = request.requestStatus.code === "PENDING";

    return {
      ...obj,
      canEdit: isPending,
      canDelete: isPending,
    };
  });
};

export const updateLeaveRequestService = async (id, data, userId) => {
  const employee = await Employee.findOne({ user: userId });

  const request = await LeaveRequest.findOne({
    _id: id,
    employee: employee._id,
    isActive: true,
  }).populate("requestStatus");

  if (!request) {
    throw new Error("Leave request not found.");
  }

  if (request.requestStatus.code !== "PENDING") {
    throw new Error("Only pending requests can be updated.");
  }

  Object.assign(request, {
    ...data,
    updatedBy: userId,
  });

  await request.save();

  return request;
};

export const deleteLeaveRequestService = async (id, userId) => {
  const employee = await Employee.findOne({ user: userId });

  const request = await LeaveRequest.findOne({
    _id: id,
    employee: employee._id,
    isActive: true,
  }).populate("requestStatus");

  if (!request) {
    throw new Error("Leave request not found.");
  }

  if (request.requestStatus.code !== "PENDING") {
    throw new Error("Only pending requests can be deleted.");
  }

  request.isActive = false;
  request.updatedBy = userId;

  await request.save();

  return true;
};
