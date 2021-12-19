import { useAsyncState, useTitle } from '@vueuse/core';
import { useConfirm } from 'primevue/useconfirm';
import {
  computed, inject, Ref, ref,
} from 'vue';
import { Topics } from '../Enums';
import { ICellWrapper } from '../Interfaces';
import { PropertyDefinition, ViewDefinition, WorkbookDefinition } from '../middleware/web-api';
import router from '../router';
import TableStore from '../stores/TableStore';
import WorkbooksStore from '../stores/WorkbooksStore';
import WorkbookStore from '../stores/WorkbookStore';
import { getBreadcrumbForItem } from '../utils/BreadcrumbHub';
import EventBus from '@/ts/utils/EventBus';
import ItemDetailsViewModel from './ItemDetailsViewModel';
import { EventEmitter } from '../utils/EventsEmitter';

export class WorkbookItemViewModel extends EventEmitter {
  isNewItem = computed(() => this.itemShortId === 'new');

  showSplitPanel = computed(() =>
    this.viewMode.value === 'files'
    || this.viewMode.value === 'history'
    || this.viewMode.value === 'permission');

  columns = ref<PropertyDefinition[]>([]);

  workbookShortId = ref();

  tableStoreRef = ref<TableStore>();

  itemFullId = ref<string>('');

  itemDetailViewModel = ref<ItemDetailsViewModel>();

  confirmService = useConfirm();

  cellWrappers = ref<ICellWrapper[]>([]);

  workbooksStore = inject('WorkbooksStore') as WorkbooksStore;

  currentView = ref<ViewDefinition>();

  isReady = ref<boolean>(false);

  constructor(
    public itemShortId: string,
    public workbookId: string,
    public viewShortId: string,
    public viewMode: Ref<string | string[] | null>,
    public isPopupMode = false,
  ) {
    super();

    useAsyncState(async () => {
      const workbookDefinition = await this.workbooksStore.getWorkbookById(this.workbookId);
      const store = new WorkbookStore(workbookDefinition);

      store.setCurrentViewByShortId(this.viewShortId);
      this.columns.value = store.currentViewColumns;
      this.currentView.value = store.currentView;

      const { currentWorkbookId, currentViewId } = store;
      this.workbookShortId.value = store.workbook.shortId;
      const tableStore = new TableStore(currentWorkbookId, currentViewId);
      const rowValue = await tableStore.getRow(this.itemShortId);
      this.tableStoreRef.value = tableStore;

      if (!isPopupMode) {
        const itemName = (rowValue.c1 as string) || 'Untitled';
        this.updateBreadcrumb(workbookDefinition, itemName);
        useTitle(`${workbookDefinition.name} - ${itemName}`);
      }

      this.itemFullId.value = (rowValue.s_id as string) || '';
      this.itemDetailViewModel.value = new ItemDetailsViewModel(rowValue, tableStore, this.confirmService);

      this.itemDetailViewModel.value.on('deletedEvent', () => {
        this.fire('backToParent');
      });
      this.cellWrappers.value = this.itemDetailViewModel.value?.buildCellsWrapper(this.columns.value);
      this.isReady.value = true;
    }, null);
  }

  updateBreadcrumb = (workbook: WorkbookDefinition, itemName: string) => {
    const breadcrumb = getBreadcrumbForItem(workbook, itemName);
    EventBus.emit(Topics.UpdateBreadcrumb, breadcrumb);
  };

  goEditMode = () => {
    this.viewMode.value = 'edit';
    if (!this.isPopupMode) router.push({ path: router.currentRoute.value.fullPath, query: { viewMode: 'edit' } });
  };

  goHistoryMode = () => {
    if (this.viewMode.value === 'history') this.goEditMode();
    else {
      this.viewMode.value = 'history';
      if (!this.isPopupMode) router.push({ path: router.currentRoute.value.fullPath, query: { viewMode: 'history' } });
    }
  };

  goFileMode = () => {
    if (this.viewMode.value === 'files') this.goEditMode();
    else {
      this.viewMode.value = 'files';
      if (!this.isPopupMode) router.push({ path: router.currentRoute.value.fullPath, query: { viewMode: 'files' } });
    }
  };

  goPermissionMode = () => {
    if (this.viewMode.value === 'permission') this.goEditMode();
    else {
      this.viewMode.value = 'permission';
      if (!this.isPopupMode) {
        router.push(
          {
            path: router.currentRoute.value.fullPath,
            query: { viewMode: 'permission' },
          },
        );
      }
    }
  };

  updateItem = async (backToParent = true) => {
    if (this.isNewItem.value) {
      await this.itemDetailViewModel.value?.insert(this.cellWrappers.value);
    } else {
      await this.itemDetailViewModel.value?.update(this.cellWrappers.value);
    }
    if (backToParent) {
      this.fire('backToParent');
    }
  };

  deleteItem = () => {
    this.itemDetailViewModel.value?.delete();
  };
}

export default WorkbookItemViewModel;
