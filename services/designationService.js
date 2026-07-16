import Designation from "../models/designationModel.js";

export const getDesignationsService = async () => {
  return await Designation.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createDesignationService = async (data, userId) => {
  const { name, code, description } = data;

  const existingDesignation = await Designation.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingDesignation) {
    throw new Error("Designation name or code already exists");
  }

  const designation = await Designation.create({
    name,
    code,
    description,
    createdBy: userId,
  });

  return designation;
};

export const updateDesignationService = async (designationId, data, userId) => {
  const { name, code, description } = data;

  const designation = await Designation.findOne({
    _id: designationId,
    isActive: true,
  });

  if (!designation) {
    throw new Error("Designation not found");
  }

  const existingDesignation = await Designation.findOne({
    _id: { $ne: designationId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingDesignation) {
    throw new Error("Designation name or code already exists");
  }

  designation.name = name;
  designation.code = code.toUpperCase();
  designation.description = description;
  designation.updatedBy = userId;

  await designation.save();

  return designation;
};

export const deleteDesignationService = async (designationId, userId) => {
  const designation = await Designation.findOne({
    _id: designationId,
    isActive: true,
  });

  if (!designation) {
    throw new Error("Designation not found");
  }

  designation.isActive = false;
  designation.updatedBy = userId;

  await designation.save();

  return designation;
};
