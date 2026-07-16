import {
  createRequestStatusService,
  deleteRequestStatusService,
  getRequestStatusesService,
  updateRequestStatusService,
} from "../services/requestStatusService.js";

export const getRequestStatuses = async (req, res) => {
  try {
    const requestStatuses = await getRequestStatusesService();

    res.status(200).json({
      success: true,
      data: requestStatuses,
      message: "Request statuses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createRequestStatus = async (req, res) => {
  try {
    const requestStatus = await createRequestStatusService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: requestStatus,
      message: "Request status created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const requestStatus = await updateRequestStatusService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: requestStatus,
      message: "Request status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRequestStatus = async (req, res) => {
  try {
    await deleteRequestStatusService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Request status deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
