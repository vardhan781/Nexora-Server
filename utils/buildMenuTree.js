export const buildMenuTree = (menus) => {
  const map = new Map();

  const tree = [];

  menus.forEach((menu) => {
    map.set(menu._id.toString(), {
      _id: menu._id,
      menuName: menu.menuName,
      menuCode: menu.menuCode,
      route: menu.route,
      icon: menu.icon,
      displayOrder: menu.displayOrder,
      parentMenu: menu.parentMenu,
      isActive: menu.isActive,
      isVisible: menu.isVisible,
      children: [],
    });
  });

  menus.forEach((menu) => {
    const node = map.get(menu._id.toString());

    if (menu.parentMenu) {
      const parent = map.get(menu.parentMenu.toString());

      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  const sortTree = (nodes) => {
    nodes.sort((a, b) => a.displayOrder - b.displayOrder);

    nodes.forEach((n) => {
      if (n.children.length) {
        sortTree(n.children);
      }
    });
  };

  sortTree(tree);

  return tree;
};
