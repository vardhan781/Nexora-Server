import {
  createSalaryComponentService,
  getSalaryComponentsService,
  getSalaryComponentByIdService,
  updateSalaryComponentService,
  deleteSalaryComponentService,
} from "../services/salaryComponentService.js";

export const getSalaryComponents = async (req, res) => {
  try {
    const salaryComponents = await getSalaryComponentsService();

    res.status(200).json({
      success: true,
      data: salaryComponents,
      message: "Salary components fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSalaryComponentById = async (req, res) => {
  try {
    const salaryComponent = await getSalaryComponentByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: salaryComponent,
      message: "Salary component fetched successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSalaryComponent = async (req, res) => {
  try {
    const salaryComponent = await createSalaryComponentService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: salaryComponent,
      message: "Salary component created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSalaryComponent = async (req, res) => {
  try {
    const salaryComponent = await updateSalaryComponentService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: salaryComponent,
      message: "Salary component updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSalaryComponent = async (req, res) => {
  try {
    await deleteSalaryComponentService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Salary component deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
