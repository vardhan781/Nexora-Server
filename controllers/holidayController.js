import {
  getHolidaysService,
  createHolidayService,
  updateHolidayService,
  deleteHolidayService,
} from "../services/holidayService.js";

export const getAllHolidays = async (req, res) => {
  try {
    const holidays = await getHolidaysService();

    return res.status(200).json({
      success: true,
      message: "Holidays fetched successfully",
      data: holidays,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const holiday = await createHolidayService(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Holiday created successfully",
      data: holiday,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHoliday = async (req, res) => {
  try {
    const holiday = await updateHolidayService(
      req.params.id,
      req.body,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Holiday updated successfully",
      data: holiday,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    await deleteHolidayService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
