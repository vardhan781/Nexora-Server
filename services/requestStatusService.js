import RequestStatus from "../models/requestStatusModel.js";

export const getRequestStatusesService = async () => {
  return await RequestStatus.find({ isActive: true }).sort({
    createdAt: -1,
  });
};

export const createRequestStatusService = async (data, userId) => {
  const { name, code, description } = data;

  const existingRequestStatus = await RequestStatus.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingRequestStatus) {
    throw new Error("Request status name or code already exists");
  }

  const requestStatus = await RequestStatus.create({
    name,
    code: code.toUpperCase(),
    description,
    createdBy: userId,
  });

  return requestStatus;
};

export const updateRequestStatusService = async (
  requestStatusId,
  data,
  userId,
) => {
  const { name, code, description } = data;

  const requestStatus = await RequestStatus.findOne({
    _id: requestStatusId,
    isActive: true,
  });

  if (!requestStatus) {
    throw new Error("Request status not found");
  }

  const existingRequestStatus = await RequestStatus.findOne({
    _id: { $ne: requestStatusId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingRequestStatus) {
    throw new Error("Request status name or code already exists");
  }

  requestStatus.name = name;
  requestStatus.code = code.toUpperCase();
  requestStatus.description = description;
  requestStatus.updatedBy = userId;

  await requestStatus.save();

  return requestStatus;
};

export const deleteRequestStatusService = async (requestStatusId, userId) => {
  const requestStatus = await RequestStatus.findOne({
    _id: requestStatusId,
    isActive: true,
  });

  if (!requestStatus) {
    throw new Error("Request status not found");
  }

  requestStatus.isActive = false;
  requestStatus.updatedBy = userId;

  await requestStatus.save();

  return requestStatus;
};
