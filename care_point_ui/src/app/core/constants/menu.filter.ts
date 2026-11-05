import { MenuItem } from 'primeng/api';

type PermissionMenuItem = MenuItem & {
  permission?: string;
  items?: PermissionMenuItem[];
};

export function filterMenu(
  items: PermissionMenuItem[],
  hasPermission: (permission: string) => boolean,
): PermissionMenuItem[] {
  return items.reduce<PermissionMenuItem[]>((visibleItems, item) => {
    if (item.items?.length) {
      const visibleChildren = filterMenu(item.items, hasPermission);

      if (visibleChildren.length === 0) {
        return visibleItems;
      }

      visibleItems.push({
        ...item,
        items: visibleChildren,
      });

      return visibleItems;
    }

    const permission = item.permission;

    if (permission && !hasPermission(permission)) {
      return visibleItems;
    }

    visibleItems.push(item);
    return visibleItems;
  }, []);
}
