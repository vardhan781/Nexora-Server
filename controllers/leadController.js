import {
  assignLeadService,
  convertLeadService,
  createLeadService,
  deleteLeadService,
  getLeadByIdService,
  getLeadStatsService,
  getLeadsService,
  getMyLeadsService,
  updateLeadService,
  updateLeadStatusService,
} from "../services/leadService.js";

export const getLeads = async (req, res) => {
  try {
    const leads = await getLeadsService(req.query);

    res.status(200).json({
      success: true,
      data: leads,
      message: "Leads fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLead = async (req, res) => {
  try {
    const lead = await createLeadService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      data: lead,
      message: "Lead created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await getLeadByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: lead,
      message: "Lead fetched successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await updateLeadService(req.params.id, req.body, req.user._id);

    res.status(200).json({
      success: true,
      data: lead,
      message: "Lead updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    await deleteLeadService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyLeads = async (req, res) => {
  try {
    const leads = await getMyLeadsService(req.user._id, req.query);

    res.status(200).json({
      success: true,
      data: leads,
      message: "My leads fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignLead = async (req, res) => {
  try {
    const lead = await assignLeadService(
      req.params.id,
      req.body.assignedTo,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: lead,
      message: "Lead assigned successfully",
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
    const lead = await updateLeadStatusService(
      req.params.id,
      req.body.leadStatus,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: lead,
      message: "Lead status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeadStats = async (req, res) => {
  try {
    const stats = await getLeadStatsService();

    res.status(200).json({
      success: true,
      data: stats,
      message: "Lead statistics fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const convertLead = async (req, res) => {
  try {
    const lead = await convertLeadService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      data: lead,
      message: "Lead converted to client successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
