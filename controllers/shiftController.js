import {
  getShiftsService,
  createShiftService,
  updateShiftService,
  deleteShiftService,
} from "../services/shiftService.js";

export const getAllShifts = async (req, res) => {
  try {
    const shifts = await getShiftsService();

    return res.status(200).json({
      success: true,
      message: "Shifts fetched successfully",
      data: shifts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createShift = async (req, res) => {
  try {
    const shift = await createShiftService(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Shift created successfully",
      data: shift,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateShift = async (req, res) => {
  try {
    const shift = await updateShiftService(
      req.params.id,
      req.body,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Shift updated successfully",
      data: shift,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteShift = async (req, res) => {
  try {
    await deleteShiftService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
