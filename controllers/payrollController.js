import {
  generatePayrollService,
  generateAllPayrollService,
  getPayrollService,
  getPayrollByIdService,
} from "../services/payrollService.js";

export const generatePayroll = async (req, res) => {
  try {
    const payroll = await generatePayrollService(
      req.body.employee,
      req.body.payrollMonth,
      req.body.payrollYear,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: payroll,
      message: "Payroll generated successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateAllPayroll = async (req, res) => {
  try {
    const result = await generateAllPayrollService(
      req.body.payrollMonth,
      req.body.payrollYear,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Payroll generated successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPayroll = async (req, res) => {
  try {
    const payrolls = await getPayrollService(req.query);

    res.status(200).json({
      success: true,
      data: payrolls,
      message: "Payrolls fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPayrollById = async (req, res) => {
  try {
    const payroll = await getPayrollByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: payroll,
      message: "Payroll fetched successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
