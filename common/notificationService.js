import Notification from "../models/notificationModel.js";

export const createNotification = async ({
  employee,
  notificationType,
  title,
  message,
  referenceId = null,
  createdBy = null,
}) => {
  return await Notification.create({
    employee,
    notificationType,
    title,
    message,
    referenceId,
    createdBy,
    updatedBy: createdBy,
  });
};
