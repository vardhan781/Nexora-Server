import {
  createLeadStatusService,
  deleteLeadStatusService,
  getLeadStatusesService,
  updateLeadStatusService,
} from "../services/leadStatusService.js";

export const getLeadStatuses = async (req, res) => {
  try {
    const leadStatuses = await getLeadStatusesService();

    res.status(200).json({
      success: true,
      data: leadStatuses,
      message: "Lead statuses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLeadStatus = async (req, res) => {
  try {
    const leadStatus = await createLeadStatusService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      data: leadStatus,
      message: "Lead status created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const leadStatus = await updateLeadStatusService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: leadStatus,
      message: "Lead status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeadStatus = async (req, res) => {
  try {
    await deleteLeadStatusService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Lead status deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
