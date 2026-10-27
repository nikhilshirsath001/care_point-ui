import { MenuItem } from 'primeng/api';

export function filterMenu(items: MenuItem[], has: (p: string) => boolean): MenuItem[] {
  return items
    .map(item => {
      if (item.items?.length) {
        const children = filterMenu(item.items as MenuItem[], has);
        return children.length ? {...item, items: children} : null;
      }
      const permission = item['permission'] as string | undefined;
      return permission && !has(permission) ? null : item;
    })
    .filter((item): item is MenuItem => item !== null);
}
