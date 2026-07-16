import {
  createMenuService,
  deleteMenuService,
  getAllMenusTreeService,
  getSidebarMenusService,
  updateMenuService,
} from "../services/menuService.js";

export const getSidebarMenus = async (req, res) => {
  try {
    const menus = await getSidebarMenusService(req.user.role._id);

    res.status(200).json({
      success: true,
      message: "Sidebar menus fetched successfully",
      data: menus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createMenu = async (req, res) => {
  try {
    const menu = await createMenuService(req.body, req.user._id);

    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMenus = async (req, res) => {
  try {
    const menus = await getAllMenusTreeService();

    res.json({
      success: true,
      data: menus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const menu = await updateMenuService(req.params.id, req.body, req.user._id);

    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const menu = await deleteMenuService(req.params.id, req.user._id);

    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
