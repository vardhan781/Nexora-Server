import ActivityLog from "../models/activityLogModel.js";

export const createActivityLog = async ({
  module,
  action,
  description,
  employee = null,
  user = null,
  referenceId = null,
  createdBy = null,
}) => {
  return await ActivityLog.create({
    module,
    action,
    description,
    employee,
    user,
    referenceId,
    createdBy,
    updatedBy: createdBy,
  });
};
