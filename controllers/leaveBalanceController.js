import {
  getLeaveBalancesService,
  createLeaveBalanceService,
  updateLeaveBalanceService,
  deleteLeaveBalanceService,
  getMyLeaveBalancesService,
} from "../services/leaveBalanceService.js";

export const getLeaveBalances = async (req, res) => {
  try {
    const leaveBalances = await getLeaveBalancesService();

    res.status(200).json({
      success: true,
      data: leaveBalances,
      message: "Leave balances fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLeaveBalance = async (req, res) => {
  try {
    const leaveBalance = await createLeaveBalanceService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: leaveBalance,
      message: "Leave balance created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeaveBalance = async (req, res) => {
  try {
    const leaveBalance = await updateLeaveBalanceService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: leaveBalance,
      message: "Leave balance updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeaveBalance = async (req, res) => {
  try {
    await deleteLeaveBalanceService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Leave balance deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyLeaveBalances = async (req, res) => {
  try {
    const leaveBalances = await getMyLeaveBalancesService(
      req.user._id,
      req.query.year,
    );

    res.status(200).json({
      success: true,
      data: leaveBalances,
      message: "Leave balances fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
