import Menu from "../models/menuModel.js";
import MenuRight from "../models/menuRightModel.js";

const permissionMiddleware =
  (menuCode, permission) => async (req, res, next) => {
    try {
      const role = req.user?.role;

      if (!role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (role.roleCode === "SUPER_ADMIN") {
        return next();
      }

      const menu = await Menu.findOne({
        menuCode,
        isActive: true,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found",
        });
      }

      const menuRight = await MenuRight.findOne({
        role: role._id,
        menu: menu._id,
        isActive: true,
      });

      if (!menuRight || !menuRight[permission]) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };

export default permissionMiddleware;
