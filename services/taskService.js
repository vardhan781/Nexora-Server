import Employee from "../models/employeeModel.js";
import TaskComment from "../models/taskCommentModel.js";
import Task from "../models/taskModel.js";
import TaskPriority from "../models/taskPriorityModel.js";
import TaskStatus from "../models/taskStatusModel.js";

export const createTaskService = async (data, userId) => {
  const {
    title,
    description,
    assignedTo,
    taskPriority,
    startDate,
    dueDate,
    remarks,
  } = data;

  const assignedEmployee = await Employee.findOne({
    _id: assignedTo,
    isActive: true,
  });

  if (!assignedEmployee) {
    throw new Error("Assigned employee not found");
  }

  const loggedInEmployee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!loggedInEmployee) {
    throw new Error("Logged in employee not found");
  }

  const priority = await TaskPriority.findOne({
    _id: taskPriority,
    isActive: true,
  });

  if (!priority) {
    throw new Error("Task priority not found");
  }

  const pendingStatus = await TaskStatus.findOne({
    code: "PENDING",
    isActive: true,
  });

  if (!pendingStatus) {
    throw new Error("Pending task status not found");
  }

  const taskStartDate = startDate ? new Date(startDate) : new Date();
  const taskDueDate = new Date(dueDate);

  if (taskDueDate < taskStartDate) {
    throw new Error("Due date cannot be before start date");
  }

  const lastTask = await Task.findOne().sort({ taskCode: -1 });

  let taskCode = "TASK0001";

  if (lastTask) {
    const lastNumber = parseInt(lastTask.taskCode.replace("TASK", ""), 10);
    taskCode = `TASK${String(lastNumber + 1).padStart(4, "0")}`;
  }

  const task = await Task.create({
    taskCode,
    title: title.trim(),
    description: description?.trim() || "",
    assignedTo,
    assignedBy: loggedInEmployee._id,
    taskStatus: pendingStatus._id,
    taskPriority,
    startDate: taskStartDate,
    dueDate: taskDueDate,
    remarks: remarks?.trim() || "",
    createdBy: userId,
  });

  return task;
};

export const getTasksService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    taskStatus,
    taskPriority,
    assignedTo,
  } = query;

  const filter = {
    isActive: true,
  };

  if (search.trim()) {
    filter.$or = [
      { taskCode: { $regex: search.trim(), $options: "i" } },
      { title: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (taskStatus) {
    filter.taskStatus = taskStatus;
  }

  if (taskPriority) {
    filter.taskPriority = taskPriority;
  }

  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  const totalRecords = await Task.countDocuments(filter);

  const tasks = await Task.find(filter)
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("assignedBy", "employeeCode firstName lastName")
    .populate("taskStatus", "name code")
    .populate("taskPriority", "name code")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return {
    tasks,
    pagination: {
      totalRecords,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRecords / limit),
      pageSize: Number(limit),
    },
  };
};

export const getTaskByIdService = async (taskId) => {
  const task = await Task.findOne({
    _id: taskId,
    isActive: true,
  })
    .populate("assignedTo", "employeeCode firstName lastName")
    .populate("assignedBy", "employeeCode firstName lastName")
    .populate("taskStatus", "name code")
    .populate("taskPriority", "name code")
    .populate("createdBy", "name officialEmail")
    .populate("updatedBy", "name officialEmail");

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const updateTaskService = async (taskId, data, userId) => {
  const {
    title,
    description,
    assignedTo,
    taskPriority,
    startDate,
    dueDate,
    remarks,
  } = data;

  const task = await Task.findOne({
    _id: taskId,
    isActive: true,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const assignedEmployee = await Employee.findOne({
    _id: assignedTo,
    isActive: true,
  });

  if (!assignedEmployee) {
    throw new Error("Assigned employee not found");
  }

  const priority = await TaskPriority.findOne({
    _id: taskPriority,
    isActive: true,
  });

  if (!priority) {
    throw new Error("Task priority not found");
  }

  const taskStartDate = startDate ? new Date(startDate) : task.startDate;

  const taskDueDate = dueDate ? new Date(dueDate) : task.dueDate;

  if (taskDueDate < taskStartDate) {
    throw new Error("Due date cannot be before start date");
  }

  task.title = title.trim();
  task.description = description?.trim() || "";
  task.assignedTo = assignedTo;
  task.taskPriority = taskPriority;
  task.startDate = taskStartDate;
  task.dueDate = taskDueDate;
  task.remarks = remarks?.trim() || "";
  task.updatedBy = userId;

  await task.save();

  return task;
};

export const deleteTaskService = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isActive: true,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  task.isActive = false;
  task.updatedBy = userId;

  await task.save();

  return task;
};

export const getMyTasksService = async (userId, query) => {
  const { search = "", taskStatus, taskPriority } = query;

  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const filter = {
    assignedTo: employee._id,
    isActive: true,
  };

  if (search.trim()) {
    filter.$or = [
      {
        taskCode: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        title: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (taskStatus) {
    filter.taskStatus = taskStatus;
  }

  if (taskPriority) {
    filter.taskPriority = taskPriority;
  }

  const tasks = await Task.find(filter)
    .populate("assignedBy", "employeeCode firstName lastName")
    .populate("taskStatus", "name code")
    .populate("taskPriority", "name code")
    .sort({ createdAt: -1 });

  return tasks;
};

export const updateTaskStatusService = async (taskId, taskStatus, userId) => {
  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const task = await Task.findOne({
    _id: taskId,
    assignedTo: employee._id,
    isActive: true,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const status = await TaskStatus.findOne({
    _id: taskStatus,
    isActive: true,
  });

  if (!status) {
    throw new Error("Task status not found");
  }

  task.taskStatus = status._id;

  if (status.code === "COMPLETED") {
    task.completedAt = new Date();
  } else {
    task.completedAt = null;
  }

  task.updatedBy = userId;

  await task.save();

  return task;
};

export const addTaskCommentService = async (taskId, data, userId) => {
  const { comment } = data;

  const employee = await Employee.findOne({
    user: userId,
    isActive: true,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const task = await Task.findOne({
    _id: taskId,
    isActive: true,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const taskComment = await TaskComment.create({
    task: task._id,
    employee: employee._id,
    comment: comment.trim(),
    createdBy: userId,
  });

  return taskComment;
};

export const getTaskCommentsService = async (taskId) => {
  const task = await Task.findOne({
    _id: taskId,
    isActive: true,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const taskComments = await TaskComment.find({
    task: taskId,
    isActive: true,
  })
    .populate("employee", "employeeCode firstName lastName")
    .sort({ createdAt: 1 });

  return taskComments;
};
