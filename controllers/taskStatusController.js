import {
  createTaskStatusService,
  deleteTaskStatusService,
  getTaskStatusesService,
  updateTaskStatusService,
} from "../services/taskStatusService.js";

export const getTaskStatuses = async (req, res) => {
  try {
    const taskStatuses = await getTaskStatusesService();

    res.status(200).json({
      success: true,
      data: taskStatuses,
      message: "Task statuses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTaskStatus = async (req, res) => {
  try {
    const taskStatus = await createTaskStatusService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      data: taskStatus,
      message: "Task status created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const taskStatus = await updateTaskStatusService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: taskStatus,
      message: "Task status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTaskStatus = async (req, res) => {
  try {
    await deleteTaskStatusService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Task status deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
