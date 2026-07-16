import Role from "../models/roleModel.js";

export const getAllRolesService = async () => {
  const roles = await Role.find({ isActive: true }).sort({
    createdAt: -1,
  });

  return roles;
};

export const createRoleService = async (roleData, userId) => {
  const { roleName, roleCode, description } = roleData;

  const existingRoleName = await Role.findOne({
    roleName: {
      $regex: new RegExp(`^${roleName}$`, "i"),
    },
    isActive: true,
  });

  if (existingRoleName) {
    throw new Error("Role name already exists");
  }

  const existingRoleCode = await Role.findOne({
    roleCode: roleCode.toUpperCase(),
    isActive: true,
  });

  if (existingRoleCode) {
    throw new Error("Role code already exists");
  }

  const role = await Role.create({
    roleName,
    roleCode: roleCode.toUpperCase(),
    description,
    createdBy: userId,
  });

  return role;
};

export const updateRoleService = async (roleId, roleData, userId) => {
  const { roleName, roleCode, description, isActive } = roleData;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (role.isSystemRole) {
    throw new Error("System roles cannot be modified");
  }

  const existingRoleName = await Role.findOne({
    roleName: {
      $regex: new RegExp(`^${roleName}$`, "i"),
    },
    _id: {
      $ne: roleId,
    },
    isActive: true,
  });

  if (existingRoleName) {
    throw new Error("Role name already exists");
  }

  const existingRoleCode = await Role.findOne({
    roleCode: roleCode.toUpperCase(),
    _id: {
      $ne: roleId,
    },
    isActive: true,
  });

  if (existingRoleCode) {
    throw new Error("Role code already exists");
  }

  role.roleName = roleName;
  role.roleCode = roleCode.toUpperCase();
  role.description = description;
  role.isActive = isActive;
  role.updatedBy = userId;

  await role.save();

  return role;
};

export const deleteRoleService = async (roleId, userId) => {
  const role = await Role.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (!role.isActive) {
    throw new Error("Role already deleted");
  }

  if (role.isSystemRole) {
    throw new Error("System roles cannot be deleted");
  }

  role.isActive = false;
  role.updatedBy = userId;

  await role.save();

  return role;
};
