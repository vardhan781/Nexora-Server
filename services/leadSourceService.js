import LeadSource from "../models/leadSourceModel.js";

export const getLeadSourcesService = async () => {
  return await LeadSource.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createLeadSourceService = async (data, userId) => {
  const { name, code, description } = data;

  const existingLeadSource = await LeadSource.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingLeadSource) {
    throw new Error("Lead source name or code already exists");
  }

  const leadSource = await LeadSource.create({
    name: name.trim(),
    code: code.trim().toUpperCase(),
    description: description?.trim() || "",
    createdBy: userId,
  });

  return leadSource;
};

export const updateLeadSourceService = async (leadSourceId, data, userId) => {
  const { name, code, description } = data;

  const leadSource = await LeadSource.findOne({
    _id: leadSourceId,
    isActive: true,
  });

  if (!leadSource) {
    throw new Error("Lead source not found");
  }

  const existingLeadSource = await LeadSource.findOne({
    _id: { $ne: leadSourceId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingLeadSource) {
    throw new Error("Lead source name or code already exists");
  }

  leadSource.name = name.trim();
  leadSource.code = code.trim().toUpperCase();
  leadSource.description = description?.trim() || "";
  leadSource.updatedBy = userId;

  await leadSource.save();

  return leadSource;
};

export const deleteLeadSourceService = async (leadSourceId, userId) => {
  const leadSource = await LeadSource.findOne({
    _id: leadSourceId,
    isActive: true,
  });

  if (!leadSource) {
    throw new Error("Lead source not found");
  }

  leadSource.isActive = false;
  leadSource.updatedBy = userId;

  await leadSource.save();

  return leadSource;
};
