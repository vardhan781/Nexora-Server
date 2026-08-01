import {
  createTaskPriorityService,
  deleteTaskPriorityService,
  getTaskPrioritiesService,
  updateTaskPriorityService,
} from "../services/taskPriorityService.js";

export const getTaskPriorities = async (req, res) => {
  try {
    const taskPriorities = await getTaskPrioritiesService();

    res.status(200).json({
      success: true,
      data: taskPriorities,
      message: "Task priorities fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTaskPriority = async (req, res) => {
  try {
    const taskPriority = await createTaskPriorityService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: taskPriority,
      message: "Task priority created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTaskPriority = async (req, res) => {
  try {
    const taskPriority = await updateTaskPriorityService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: taskPriority,
      message: "Task priority updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTaskPriority = async (req, res) => {
  try {
    await deleteTaskPriorityService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Task priority deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
