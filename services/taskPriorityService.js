import TaskPriority from "../models/taskPriorityModel.js";

export const getTaskPrioritiesService = async () => {
  return await TaskPriority.find({ isActive: true }).sort({ createdAt: -1 });
};

export const createTaskPriorityService = async (data, userId) => {
  const { name, code, description } = data;

  const existingTaskPriority = await TaskPriority.findOne({
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingTaskPriority) {
    throw new Error("Task priority name or code already exists");
  }

  const taskPriority = await TaskPriority.create({
    name: name.trim(),
    code: code.trim().toUpperCase(),
    description: description?.trim() || "",
    createdBy: userId,
  });

  return taskPriority;
};

export const updateTaskPriorityService = async (
  taskPriorityId,
  data,
  userId,
) => {
  const { name, code, description } = data;

  const taskPriority = await TaskPriority.findOne({
    _id: taskPriorityId,
    isActive: true,
  });

  if (!taskPriority) {
    throw new Error("Task priority not found");
  }

  const existingTaskPriority = await TaskPriority.findOne({
    _id: { $ne: taskPriorityId },
    isActive: true,
    $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
  });

  if (existingTaskPriority) {
    throw new Error("Task priority name or code already exists");
  }

  taskPriority.name = name.trim();
  taskPriority.code = code.trim().toUpperCase();
  taskPriority.description = description?.trim() || "";
  taskPriority.updatedBy = userId;

  await taskPriority.save();

  return taskPriority;
};

export const deleteTaskPriorityService = async (taskPriorityId, userId) => {
  const taskPriority = await TaskPriority.findOne({
    _id: taskPriorityId,
    isActive: true,
  });

  if (!taskPriority) {
    throw new Error("Task priority not found");
  }

  taskPriority.isActive = false;
  taskPriority.updatedBy = userId;

  await taskPriority.save();

  return taskPriority;
};
