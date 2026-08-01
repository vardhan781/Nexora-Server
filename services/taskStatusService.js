import TaskStatus from "../models/taskStatusModel.js";

export const getTaskStatusesService = async () => {
  return await TaskStatus.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createTaskStatusService = async (data, userId) => {
  const { name, code, description } = data;

  const existingTaskStatus = await TaskStatus.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingTaskStatus) {
    throw new Error("Task status name or code already exists");
  }

  const taskStatus = await TaskStatus.create({
    name: name.trim(),
    code: code.trim().toUpperCase(),
    description: description?.trim() || "",
    createdBy: userId,
  });

  return taskStatus;
};

export const updateTaskStatusService = async (taskStatusId, data, userId) => {
  const { name, code, description } = data;

  const taskStatus = await TaskStatus.findOne({
    _id: taskStatusId,
    isActive: true,
  });

  if (!taskStatus) {
    throw new Error("Task status not found");
  }

  const existingTaskStatus = await TaskStatus.findOne({
    _id: { $ne: taskStatusId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingTaskStatus) {
    throw new Error("Task status name or code already exists");
  }

  taskStatus.name = name.trim();
  taskStatus.code = code.trim().toUpperCase();
  taskStatus.description = description?.trim() || "";
  taskStatus.updatedBy = userId;

  await taskStatus.save();

  return taskStatus;
};

export const deleteTaskStatusService = async (taskStatusId, userId) => {
  const taskStatus = await TaskStatus.findOne({
    _id: taskStatusId,
    isActive: true,
  });

  if (!taskStatus) {
    throw new Error("Task status not found");
  }

  taskStatus.isActive = false;
  taskStatus.updatedBy = userId;

  await taskStatus.save();

  return taskStatus;
};
