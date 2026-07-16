import Menu from "../models/menuModel.js";
import MenuRight from "../models/menuRightModel.js";
import { buildMenuTree } from "../utils/buildMenuTree.js";

export const getSidebarMenusService = async (roleId) => {
  const menuRights = await MenuRight.find({
    role: roleId,
    canView: true,
    isActive: true,
  }).populate("menu");

  const allowedMenuIds = menuRights.map((item) => item.menu._id.toString());

  const menus = await Menu.find({
    _id: { $in: allowedMenuIds },
    isActive: true,
    isVisible: true,
  }).sort({
    displayOrder: 1,
  });

  const parentMenus = menus.filter((menu) => !menu.parentMenu);

  const sidebarMenus = parentMenus.map((parent) => ({
    _id: parent._id,
    menuName: parent.menuName,
    menuCode: parent.menuCode,
    route: parent.route,
    icon: parent.icon,
    children: menus.filter(
      (menu) =>
        menu.parentMenu && menu.parentMenu.toString() === parent._id.toString(),
    ),
  }));

  return sidebarMenus;
};

export const createMenuService = async (data, userId) => {
  const {
    menuName,
    menuCode,
    route,
    icon,
    parentMenu,
    displayOrder,
    isVisible,
    isActive,
  } = data;

  const exists = await Menu.findOne({ menuCode, isActive: true });

  if (exists) {
    throw new Error("Menu code already exists");
  }

  const existingMenuName = await Menu.findOne({
    menuName,
    parentMenu: parentMenu || null,
    isActive: true,
  });

  if (existingMenuName) {
    throw new Error(`Menu '${menuName}' already exists under this parent`);
  }

  const existingDisplayOrder = await Menu.findOne({
    displayOrder,
    parentMenu: parentMenu || null,
    isActive: true,
  });

  if (existingDisplayOrder) {
    throw new Error(`Display Order ${displayOrder} already exists`);
  }

  const menu = await Menu.create({
    menuName,
    menuCode,
    route,
    icon,
    parentMenu: parentMenu || null,
    displayOrder: displayOrder || 0,
    isVisible: isVisible ?? true,
    isActive: isActive ?? true,
    createdBy: userId,
  });

  return menu;
};

export const updateMenuService = async (menuId, data, userId) => {
  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new Error("Menu not found");
  }

  const displayOrder = data.displayOrder ?? menu.displayOrder;
  const parentMenu = data.parentMenu ?? menu.parentMenu;
  const menuName = data.menuName ?? menu.menuName;

  if (data.menuCode && data.menuCode !== menu.menuCode) {
    const exists = await Menu.findOne({
      menuCode: data.menuCode,
      isActive: true,
      _id: { $ne: menuId },
    });

    if (exists) {
      throw new Error("Menu code already exists");
    }
  }

  const existingMenuName = await Menu.findOne({
    _id: { $ne: menuId },
    menuName,
    parentMenu: parentMenu || null,
    isActive: true,
  });

  if (existingMenuName) {
    throw new Error(`Menu '${menuName}' already exists under this parent`);
  }

  const existingDisplayOrder = await Menu.findOne({
    _id: { $ne: menuId },
    displayOrder,
    parentMenu: parentMenu || null,
    isActive: true,
  });

  if (existingDisplayOrder) {
    throw new Error(`Display Order ${displayOrder} already exists`);
  }

  const updatedMenu = await Menu.findByIdAndUpdate(
    menuId,
    {
      ...data,
      updatedBy: userId,
    },
    { returnDocument: "after" },
  );

  return updatedMenu;
};

export const deleteMenuService = async (menuId, userId) => {
  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new Error("Menu not found");
  }

  const deleted = await Menu.findByIdAndUpdate(
    menuId,
    {
      isActive: false,
      updatedBy: userId,
    },
    { returnDocument: "after" },
  );

  return deleted;
};

export const getAllMenusTreeService = async () => {
  const menus = await Menu.find({
    isActive: true,
  }).sort({ displayOrder: 1 });

  return buildMenuTree(menus);
};
