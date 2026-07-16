import {
  getAllRolesService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from "../services/roleService.js";

export const getAllRoles = async (req, res) => {
  try {
    const roles = await getAllRolesService();

    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const role = await createRoleService(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await updateRoleService(req.params.id, req.body, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    await deleteRoleService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
