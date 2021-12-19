import { IBreadcrumb, IMenu } from '../Interfaces';
import { WorkbookDefinition } from '../middleware/web-api';

export const getBreadcrumb = (nodes?: IMenu[]): IBreadcrumb => {
  const root = {
    home: { icon: 'pi pi-home', to: '/' },
    items: [],
  } as IBreadcrumb;

  if (!nodes) return root;

  nodes.forEach((node) => root.items.push(node));

  return root;
};

export const getBreadcrumbForWorkbook = (workbook: WorkbookDefinition): IBreadcrumb => {
  const node = {
    label: workbook.name as string,
    to: `/${workbook.shortId}`,
  } as IMenu;

  return getBreadcrumb([node]);
};

export const getBreadcrumbForItem = (workbook: WorkbookDefinition, itemName: string): IBreadcrumb =>
  getBreadcrumb([
    {
      label: workbook.name as string,
      to: `/${workbook.shortId}`,
    },
    {
      label: itemName,
      to: '',
    },
  ]);
