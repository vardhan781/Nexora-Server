import AuditLog from "../models/auditLogModel.js";

export const createAuditLog = async ({
  module,
  action,
  referenceId,
  oldData = {},
  newData = {},
  performedBy = null,
  createdBy = null,
}) => {
  return await AuditLog.create({
    module,
    action,
    referenceId,
    oldData,
    newData,
    performedBy,
    createdBy,
    updatedBy: createdBy,
  });
};
