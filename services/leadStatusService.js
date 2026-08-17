import LeadStatus from "../models/leadStatusModel.js";

export const getLeadStatusesService = async () => {
  return await LeadStatus.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createLeadStatusService = async (data, userId) => {
  const { name, code, description } = data;

  const existingLeadStatus = await LeadStatus.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingLeadStatus) {
    throw new Error("Lead status name or code already exists");
  }

  const leadStatus = await LeadStatus.create({
    name: name.trim(),
    code: code.trim().toUpperCase(),
    description: description?.trim() || "",
    createdBy: userId,
  });

  return leadStatus;
};

export const updateLeadStatusService = async (leadStatusId, data, userId) => {
  const { name, code, description } = data;

  const leadStatus = await LeadStatus.findOne({
    _id: leadStatusId,
    isActive: true,
  });

  if (!leadStatus) {
    throw new Error("Lead status not found");
  }

  const existingLeadStatus = await LeadStatus.findOne({
    _id: { $ne: leadStatusId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingLeadStatus) {
    throw new Error("Lead status name or code already exists");
  }

  leadStatus.name = name.trim();
  leadStatus.code = code.trim().toUpperCase();
  leadStatus.description = description?.trim() || "";
  leadStatus.updatedBy = userId;

  await leadStatus.save();

  return leadStatus;
};

export const deleteLeadStatusService = async (leadStatusId, userId) => {
  const leadStatus = await LeadStatus.findOne({
    _id: leadStatusId,
    isActive: true,
  });

  if (!leadStatus) {
    throw new Error("Lead status not found");
  }

  leadStatus.isActive = false;
  leadStatus.updatedBy = userId;

  await leadStatus.save();

  return leadStatus;
};
