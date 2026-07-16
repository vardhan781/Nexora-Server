import Menu from "../models/menuModel.js";
import MenuRight from "../models/menuRightModel.js";
import Role from "../models/roleModel.js";
import { buildMenuTree } from "../utils/buildMenuTree.js";

export const getRoleMenuMatrixService = async (roleId) => {
  const roleExists = await Role.findById(roleId);
  if (!roleExists) {
    throw new Error("Role not found");
  }

  const menus = await Menu.find({ isActive: true }).sort({
    displayOrder: 1,
  });

  const rights = await MenuRight.find({
    role: roleId,
    isActive: true,
  });

  const rightsMap = new Map();

  rights.forEach((r) => {
    rightsMap.set(r.menu.toString(), r);
  });

  const matrix = menus.map((menu) => {
    const right = rightsMap.get(menu._id.toString());

    return {
      menuId: menu._id,
      menuName: menu.menuName,
      menuCode: menu.menuCode,
      parentMenu: menu.parentMenu,

      permissions: {
        view: right?.canView || false,
        create: right?.canCreate || false,
        edit: right?.canEdit || false,
        delete: right?.canDelete || false,
        approve: right?.canApprove || false,
        export: right?.canExport || false,
      },
    };
  });

  return matrix;
};

export const updateRolePermissionsService = async (
  roleId,
  permissions,
  userId,
) => {
  const roleExists = await Role.findById(roleId);
  if (!roleExists) {
    throw new Error("Role not found");
  }

  const bulkOps = permissions.map((p) => ({
    updateOne: {
      filter: {
        role: roleId,
        menu: p.menuId,
      },
      update: {
        $set: {
          role: roleId,
          menu: p.menuId,

          canView: p.permissions.view,
          canCreate: p.permissions.create,
          canEdit: p.permissions.edit,
          canDelete: p.permissions.delete,
          canApprove: p.permissions.approve,
          canExport: p.permissions.export,

          updatedBy: userId,
          isActive: true,
        },
      },
      upsert: true,
    },
  }));

  await MenuRight.bulkWrite(bulkOps);

  return {
    message: "Permissions updated successfully",
  };
};
