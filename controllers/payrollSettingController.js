import {
  createPayrollSettingService,
  getPayrollSettingService,
  updatePayrollSettingService,
} from "../services/payrollSettingService.js";

export const getPayrollSetting = async (req, res) => {
  try {
    const payrollSetting = await getPayrollSettingService();

    res.status(200).json({
      success: true,
      data: payrollSetting,
      message: "Payroll setting fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPayrollSetting = async (req, res) => {
  try {
    const payrollSetting = await createPayrollSettingService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: payrollSetting,
      message: "Payroll setting created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePayrollSetting = async (req, res) => {
  try {
    const payrollSetting = await updatePayrollSettingService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: payrollSetting,
      message: "Payroll setting updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
