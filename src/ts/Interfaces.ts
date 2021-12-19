import { ErrorObject } from '@vuelidate/core';
import TabMenu from 'primevue/tabmenu';
import {
  PropertyDefinition, Toast, FileItem,
} from '@/ts/middleware/web-api';

export interface IMenu {
  label?: string | undefined;
  icon?: string;
  to?: string;
  command?: () => void;
  url?: string;
  items?: Array<IMenu>;
  disabled?: boolean;
  visible?: boolean | (() => boolean);
  target?: string;
  separator?: boolean | undefined;
  style?: unknown;
  class?: string;
}

export interface IAppMenu {
  toggle(event: PointerEvent): void;
}

export interface IBreadcrumb {
  home: IMenu;
  items: Array<IMenu>;
}
export interface IMenuCommandEvent {
  originalEvent: PointerEvent;
}

export interface IResponse {
  toast?: Toast;
  toasts?: Array<Toast>;
}

export interface IRule {
  readonly $model: unknown;
  readonly $dirty: boolean;
  readonly $error: boolean;
  readonly $errors: ErrorObject[];
  readonly $silentErrors: ErrorObject[];
  readonly $invalid: boolean;
  readonly $anyDirty: boolean;
  readonly $pending: boolean;
}

export interface IEventBus {
  on(topic: string, handler: (payload: unknown) => void): void;
  off(type: string, fn: any): void;
  emit(topic: string, payload?: unknown): void;
}

export interface IPToast {
  add(payload: unknown): void;
}

export interface IConfirmationServiceOption {
  message?: string;
  target?: EventTarget;
  group?: string;
  icon?: string;
  header?: string;
  accept?: () => void;
  reject?: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptIcon?: string;
  rejectIcon?: string;
  blockScroll?: boolean;
  acceptClass?: string;
  rejectClass?: string;
}

export interface IConfirmationService {
  require(args: IConfirmationServiceOption): void;
  close(): void;
}

export interface IUseToast {
  add(args: {
    severity?: string;
    summary?: string;
    detail?: string;
    life?: number;
    closable?: boolean;
    group?: string;
  }): void;
  removeGroup(group: string): void;
  removeAllGroups(): void;
}

export interface dxDataGridRowObject {
  data?: any;
  groupIndex?: number;
  isEditing?: boolean;
  isExpanded?: boolean;
  isNewRow?: boolean;
  isSelected?: boolean;
  key?: any;
  rowIndex?: number;
  rowType?: string;
  values?: Array<any>;
}

export interface IDxDataGrid {
  addColumn(columnOptions: any | string): void;
  addRow(): Promise<void>;
  clearGrouping(): void;
  collapseAll(groupIndex?: number): void;
  collapseRow(key: any): Promise<void>;
  expandAll(groupIndex?: number): void;
  expandRow(key: any): Promise<void>;
  exportToExcel(selectionOnly: boolean): void;
  getSelectedRowKeys(): Array<any> & Promise<any>;
  getSelectedRowsData(): Array<any> & Promise<any>;
  getTotalSummaryValue(summaryItemName: string): any;
  getVisibleColumns(): Array<unknown>;
  getVisibleColumns(headerLevel: number): Array<unknown>;
  getVisibleRows(): Array<dxDataGridRowObject>;
  isRowExpanded(key: any): boolean;
  isRowSelected(data: any): boolean;
  isRowSelected(key: any): boolean;
  totalCount(): number;
}

export interface IEditingEvent {
  cancel: boolean;
  column: unknown;
  data: any;
  element: HTMLElement;
  key: unknown;
}

export interface IDxEvent {
  itemData: any;
  event: Event;
  cancel: boolean;
  element: HTMLElement;
  itemElement: HTMLElement;
}

export interface IFileSelectEvent extends IDxEvent {
  itemData: FileItem;
}

export interface IReorderEvent extends IDxEvent {
  component: any;
  toIndex: number;
}

export interface IRowValue {
  [key: string]: string | number | Date | unknown;
}

export interface GridBaseOption {
  selectedRowKeys?: Array<any>;
  selectedRowsData?: Array<IRowValue>;
}

export interface VTabMenu extends TabMenu {
  $el: HTMLElement;
}

export interface ILoadOptions {
  [key: string]: any;
}

export interface IToolbarOptions {
  items: any[];
}

export interface IToolbarPreparingEvent {
  element: HTMLElement;
  toolbarOptions: IToolbarOptions;
}

export interface ICellWrapper {
  index: number;
  field: string;
  value: any;
  columnDefinition: PropertyDefinition;
}

export interface ITableProperty {
  data: PropertyDefinition;
  selected: boolean;
}

export interface ICellData<Type> {
  columnIndex: number;
  key: string;
  value: Type;
  data: IRowValue;
  row: {
    cells: {
      column: PropertyDefinition;
      columnIndex: number;
    }[];
  };

  linkedKeys: string[];
}

export interface ITableCellEvent {
  itemId: string;
  itemShortId: string;
  workbookId: string;
  workbookShortId: string;
  viewShortId: string;
}

export interface IUserRoles {
  companyShortName: string;
  companyFullName: string;
  siteRoleDictionary: { [key: string]: number };
}

export interface IStatus {
  name: string;
  color: string;
}

export interface IRelatedRowData extends ITableCellEvent {
  viewId: string;
  title: string;
  status: IStatus;
  hideNameField: boolean;
}
