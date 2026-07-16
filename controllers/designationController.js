import {
  getDesignationsService,
  createDesignationService,
  updateDesignationService,
  deleteDesignationService,
} from "../services/designationService.js";

export const getDesignations = async (req, res) => {
  try {
    const designations = await getDesignationsService();

    res.status(200).json({
      success: true,
      data: designations,
      message: "Designations fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createDesignation = async (req, res) => {
  try {
    const designation = await createDesignationService(req.body, req.user._id);

    res.status(201).json({
      success: true,
      data: designation,
      message: "Designation created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDesignation = async (req, res) => {
  try {
    const designation = await updateDesignationService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: designation,
      message: "Designation updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDesignation = async (req, res) => {
  try {
    await deleteDesignationService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Designation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
