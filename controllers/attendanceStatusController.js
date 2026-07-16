import {
  createAttendanceStatusService,
  deleteAttendanceStatusService,
  getAttendanceStatusService,
  updateAttendanceStatusService,
} from "../services/attendanceStatusService.js";

export const getAttendanceStatuses = async (req, res) => {
  try {
    const attendanceStatuses = await getAttendanceStatusService();

    res.status(200).json({
      success: true,
      data: attendanceStatuses,
      message: "Attendance statuses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createAttendanceStatus = async (req, res) => {
  try {
    const attendanceStatus = await createAttendanceStatusService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: attendanceStatus,
      message: "Attendance status created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const attendanceStatus = await updateAttendanceStatusService(
      req.params.id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: attendanceStatus,
      message: "Attendance status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAttendanceStatus = async (req, res) => {
  try {
    await deleteAttendanceStatusService(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Attendance status deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
