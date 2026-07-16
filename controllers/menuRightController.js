import {
  getRoleMenuMatrixService,
  updateRolePermissionsService,
} from "../services/menuRightService.js";

export const getRoleMenuMatrix = async (req, res) => {
  try {
    const { roleId } = req.params;

    const matrix = await getRoleMenuMatrixService(roleId);

    return res.status(200).json({
      success: true,
      message: "Role menu matrix fetched successfully",
      data: matrix,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;

    const result = await updateRolePermissionsService(
      roleId,
      permissions,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
