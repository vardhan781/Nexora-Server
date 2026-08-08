import {
  addTaskCommentService,
  createTaskService,
  deleteTaskService,
  getMyTasksService,
  getTaskByIdService,
  getTaskCommentsService,
  getTasksService,
  updateTaskService,
  updateTaskStatusService,
} from "../services/taskService.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await getTasksService(req.query);

    res.status(200).json({
      success: true,
      data: tasks,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await createTaskService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await getTaskByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: task,
      message: "Task fetched successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await updateTaskService(req.params.id, req.body, req.user._id);

    res.status(200).json({
      success: true,
      data: task,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await deleteTaskService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await getMyTasksService(req.user._id, req.query);

    res.status(200).json({
      success: true,
      data: tasks,
      message: "My tasks fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = await updateTaskStatusService(
      req.params.id,
      req.body.taskStatus,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: task,
      message: "Task status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addTaskComment = async (req, res) => {
  try {
    const taskComment = await addTaskCommentService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: taskComment,
      message: "Task comment added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const taskComments = await getTaskCommentsService(req.params.id);

    res.status(200).json({
      success: true,
      data: taskComments,
      message: "Task comments fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
