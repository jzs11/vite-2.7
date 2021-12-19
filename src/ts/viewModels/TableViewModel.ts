import { DxDataGrid } from 'devextreme-vue';
import { ref, Ref, watch } from 'vue';
import CustomStore from 'devextreme/data/custom_store';
import { useConfirm } from 'primevue/useconfirm';
import { useStorage } from '@vueuse/core';
import { LoadOptions } from 'devextreme/data';
import { isArray, isString } from 'lodash';
import WorkbookStore from '../stores/WorkbookStore';
import {
  ILoadOptions, IRowValue, IConfirmationService, ITableCellEvent,
} from '../Interfaces';
import { info } from '../utils/ToastHelpers';
import { getConfirmation } from '../Confirmations';
import { StampResponse } from '../middleware/web-api';
import TableStore from '../stores/TableStore';
import { EventEmitter } from '../utils/EventsEmitter';

class TableViewModel extends EventEmitter {
  wrapCellInStorage = ref(false);

  searchText = ref('');

  private encodeFilter = (filter: Array<string | object>) => {
    if (filter[0] === '!') {
      this.encodeFilter(filter[1] as Array<string | object>);
    } else {
      if (isArray(filter[0])) {
        this.encodeFilter(filter[0]);
      }
      if (isArray(filter[2])) {
        this.encodeFilter(filter[2]);
      }

      if (isString(filter[2])) {
        filter[2] = encodeURIComponent(filter[2]);
      }
    }
  };

  dataSource = new CustomStore({
    key: 's_id',
    load: async (loadOptions: ILoadOptions) => this.tableStore.loadAllRows(loadOptions),
    onLoading: (options: LoadOptions) => {
      if (options.filter && options.filter.length > 0) this.encodeFilter(options.filter);
    },
    update: async (key, values) => {
      const result = await this.tableStore.updateRow(key, values);

      if (result.status === 1) {
        this.grid.value?.instance?.getDataSource().reload();
      }
      return result;
    },
    insert: async () => {
      this.resetGrid();
      const result = await this.tableStore.requestNewRow();
      return result;
    },
    remove: async (key) => {
      await this.tableStore.deleteRow(key);
    },
  });

  constructor(
    public grid: Ref<DxDataGrid | undefined>,
    public selectedItemKey: Ref<string | undefined>,
    public store: WorkbookStore,
    public tableStore: TableStore,
    public confirmationService: IConfirmationService = useConfirm(),
  ) {
    super();

    tableStore.on('rowCountEvent', (payload) => {
      this.fire('rowCountEvent', payload.data);
    });

    this.wrapCellInStorage = useStorage(`view-id-can-wrap-cell-${store.currentViewId.value}`, false);

    watch(
      () => store.currentViewId.value,
      () => {
        this.wrapCellInStorage = useStorage(`view-id-can-wrap-cell-${store.currentViewId.value}`, false);
      },
    );
  }

  toggleWrapCell(): void {
    useStorage(`view-id-can-wrap-cell-${this.store.currentViewId.value}`, !this.wrapCellInStorage.value);
  }

  resetGrid(): void {
    const instance = this.grid.value?.instance;
    if (!instance) return;
    instance.deselectAll();
    instance.clearFilter();
    instance.clearSorting();
    instance.repaint();
  }

  refresh(): void {
    this.grid.value?.instance?.refresh();
  }

  getSelectedRow(): IRowValue {
    const key = this.selectedItemKey?.value;
    const rows = this.grid?.value?.instance?.getVisibleRows();
    return rows?.find((p) => p.key === key)?.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateRow(values: any): Promise<StampResponse> {
    return this.dataSource.update(values.s_id, values);
  }

  async onNew(): Promise<void> {
    const payload = this.toTableCellEventPayload('new');
    this.fire('openItemEvent', payload);
  }

  toTableCellEventPayload(itemShortId: string, itemId = ''): ITableCellEvent {
    return {
      itemId,
      itemShortId,
      workbookId: this.store.workbook.id,
      workbookShortId: this.store.currentWorkbookShortId.value,
      viewShortId: this.store.currentView.shortId,
    } as ITableCellEvent;
  }

  onDelete(): void {
    if (!this.isAnythingSelected) {
      info('No row selected.');
      return;
    }

    const message = 'Are you sure you want to delete this record?';

    const confirmation = getConfirmation(message, () => {
      this.dataSource.remove(this.selectedItemKey.value).then(() => {
        const instance = this.grid.value?.instance;
        instance?.getDataSource().reload();
      });
    });
    this.confirmationService.require(confirmation);
  }

  get isAnythingSelected(): boolean {
    return !!this.selectedItemKey.value;
  }
}

export default TableViewModel;
