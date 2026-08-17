import {
  createLeadSourceService,
  deleteLeadSourceService,
  getLeadSourcesService,
  updateLeadSourceService,
} from "../services/leadSourceService.js";

export const getLeadSources = async (req, res) => {
  try {
    const leadSources = await getLeadSourcesService();

    res.status(200).json({
      success: true,
      data: leadSources,
      message: "Lead sources fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLeadSource = async (req, res) => {
  try {
    const leadSource = await createLeadSourceService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      data: leadSource,
      message: "Lead source created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeadSource = async (req, res) => {
  try {
    const leadSource = await updateLeadSourceService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: leadSource,
      message: "Lead source updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeadSource = async (req, res) => {
  try {
    await deleteLeadSourceService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Lead source deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
