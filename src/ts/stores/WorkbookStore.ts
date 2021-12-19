import { computed, ref, Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { EventEmitter } from '@/ts/utils/EventsEmitter';
import { ResponseStatus, Topics } from '../Enums';
import { ITableProperty } from '../Interfaces';
import network from '../middleware/Network';
import {
  PropertyDefinition,
  CopyViewCommand,
  CreateViewCommand,
  CreateWorkbookCommand,
  UpdateWorkbookCommand,
  ViewDefinition,
  ViewDefinitionServiceDataResponse,
  PropertyChangeResponse,
  WorkbookDefinition,
  ReplaceColumnValueCommand,
} from '../middleware/web-api';
import ColumnSettingHelper from '../helpers/ColumnSettingHelper';

class WorkbookStore extends EventEmitter {
  workbookRef: Ref<WorkbookDefinition> = ref(new WorkbookDefinition());

  currentViewRef: Ref<ViewDefinition> = ref(new ViewDefinition());

  currentViewId = computed(() => this.currentViewRef.value.id || '');

  currentViewShortId = computed(() => this.currentView.shortId || '');

  currentWorkbookId = computed(() => this.workbookRef.value.id || '');

  currentWorkbookShortId = computed(() => this.workbookRef.value.shortId || '');

  currentViewName = computed(() => this.currentViewRef.value.name);

  viewIdInTheStorage = ref<{ viewId: string }>();

  columnSettingHelper = new ColumnSettingHelper(this.currentViewRef);

  get workbook(): WorkbookDefinition {
    return this.workbookRef.value;
  }

  set workbook(value: WorkbookDefinition) {
    this.workbookRef.value = value;
  }

  get currentView(): ViewDefinition {
    return this.currentViewRef.value;
  }

  set currentView(value: ViewDefinition) {
    this.currentViewRef.value = value;
  }

  constructor(workbook: WorkbookDefinition) {
    super();
    this.workbook = workbook;

    if (this.workbook.views) {
      this.viewIdInTheStorage = useStorage(`last-selected-view-${this.workbook.id}`, {
        viewId: `${this.workbook.views[0].id}`,
      });
    }

    this.Init();
  }

  private Init() {
    const viewId = this.viewIdInTheStorage.value?.viewId;
    const { views } = this.workbook;

    if (views && views.length > 0) {
      let [firstMatch] = views.filter((p) => p.id === viewId);

      firstMatch = firstMatch || views[0];
      this.setView(firstMatch);
    }
  }

  onPropertyChanged(result: PropertyChangeResponse): void {
    if ((result.status as number) === ResponseStatus.Success) {
      this.currentView.stamp = result.data1?.stamp;
      this.currentView.allColumnsInOrder = result.data1?.allColumnsInOrder;
      this.currentView.columnKeys = result.data1?.columnKeys;
      this.workbook.columns = result.data2?.columns;

      this.fire(Topics.WorkbookPropertyChanged);
      this.fire(Topics.WorkbookViewChanged);
    }
  }

  get viewsWithoutCurrentView(): ViewDefinition[] {
    return this.workbook.views?.filter((p) => p.id !== this.currentView.id) || [];
  }

  get currentViewAllColumnsOrdered(): PropertyDefinition[] {
    if (!this.workbook.columns) return [];
    const copyOfColumns = this.workbook.columns.slice();
    const orderedKeys = this.currentView.allColumnsInOrder || [];
    if (orderedKeys.length > 0) {
      return copyOfColumns.sort(
        (a, b) => orderedKeys.indexOf(a.dataField || '') - orderedKeys.indexOf(b.dataField || ''),
      );
    }
    return copyOfColumns;
  }

  get currentViewProperties(): ITableProperty[] {
    if (!this.workbook.columns) return [];
    const result = this.currentViewAllColumnsOrdered.map((p) => {
      const found = this.currentView.columnKeys?.find((c) => c === p.dataField);
      const id = p.dataField;
      return {
        id,
        data: p,
        selected: !!found,
      };
    });

    return result;
  }

  get currentViewAvailableColumns(): PropertyDefinition[] {
    const result = this.currentViewProperties
      .filter((p) => p.selected)
      .flatMap((p) => p.data)
      .filter((p) => this.columnSettingHelper.getColumnSetting(p.dataField).showInTheTable);

    return result;
  }

  get currentViewColumns(): PropertyDefinition[] {
    const result = this.currentViewProperties.filter((p) => p.selected).flatMap((p) => p.data);

    return result;
  }

  get currentAvailableColumns(): PropertyDefinition[] {
    const result = this.currentViewProperties.filter((p) => p.selected).flatMap((p) => p.data);

    return result;
  }

  getColumnWidth(propertyDefinition: PropertyDefinition): number | undefined {
    return this.columnSettingHelper.getColumnSetting(propertyDefinition.dataField).width;
  }

  getColumnAllowEditing(propertyDefinition: PropertyDefinition) : boolean {
    return !!this.columnSettingHelper.getColumnSetting(propertyDefinition.dataField).allowEditing;
  }

  getColumnShowInTable(propertyDefinition: PropertyDefinition): boolean {
    return !!this.columnSettingHelper.getColumnSetting(propertyDefinition.dataField).showInTheTable;
  }

  createWorkbook = async (command: CreateWorkbookCommand): Promise<string> => {
    const result = await network.createWorkbook(command);

    if (result.id) {
      const newEntity = command as WorkbookDefinition;
      newEntity.id = result.id;
    }

    return result.id || '';
  };

  async updateWorkbook(): Promise<WorkbookDefinition> {
    const result = await network.updateWorkbook(this.workbook as UpdateWorkbookCommand);
    this.workbook.stamp = result.data?.stamp;
    return this.workbook;
  }

  async updateCurrentView(): Promise<void> {
    const result = await this.updateWorkbookView(this.currentView);
    if (result.data) {
      this.currentView = result.data;
      const index = this.workbook.views?.findIndex((p) => p.id === this.currentView.id);
      if (index !== -1) this.workbook.views?.splice(<number>index, 1, result.data);
      this.fire(Topics.WorkbookViewChanged);
    }
  }

  async updateWorkbookView(view: ViewDefinition): Promise<ViewDefinitionServiceDataResponse> {
    const result = await network.updateWorkbookView(view || this.currentView);
    Object.assign(view, { stamp: result.data?.stamp });

    return result;
  }

  setView(view: ViewDefinition): void {
    if (view) {
      this.currentView = view;
      this.viewIdInTheStorage.value = { viewId: `${view.id}` };
    }

    this.fire(Topics.WorkbookViewChanged);
  }

  setCurrentViewByShortId(viewId: string): void {
    let view = this.workbook.views?.find((p) => p.shortId === viewId);
    if (!view && this.workbook.views) {
      const [firstView] = this.workbook.views;
      view = firstView;
    }
    if (view) this.currentView = view;
  }

  async createView(viewName: string): Promise<void> {
    const payload = new CreateViewCommand();

    payload.name = viewName;
    payload.workbookId = this.currentView.workbookId;
    payload.viewId = this.currentView.id;

    const response = await network.createWorkbookView(payload);
    if (response.data) {
      this.currentView = response.data;
      this.workbook.views?.push(response.data);
      this.fire(Topics.WorkbookViewChanged);
    }
  }

  async duplicateView(view: ViewDefinition): Promise<void> {
    const payload = new CopyViewCommand();

    payload.workbookId = view.workbookId;
    payload.viewId = view.id;

    const response = await network.copyWorkbookView(payload);
    if (response.data) {
      this.currentView = response.data;
      this.workbook.views?.push(response.data);
      this.fire(Topics.WorkbookViewChanged);
    }
  }

  async copyCurrentView(): Promise<void> {
    const payload = new CopyViewCommand();

    payload.workbookId = this.currentView.workbookId;
    payload.viewId = this.currentView.id;

    const response = await network.copyWorkbookView(payload);
    if (response.data) {
      this.currentView = response.data;
      this.workbook.views?.push(response.data);
      this.fire(Topics.WorkbookViewChanged);
    }
  }

  async deleteView(view: ViewDefinition): Promise<void> {
    const response = await network.deleteWorkbookView(view.id);
    if ((response.status as number) === ResponseStatus.Success) {
      this.workbook.views = this.workbook.views?.filter((p) => p.name !== view.name);
      if (this.workbook.views && this.workbook.views.length > 0) {
        const [currentView] = this.workbook.views;

        this.currentView = currentView;
        this.fire(Topics.WorkbookViewChanged);
      }
    }
  }

  updateViewsOrder = async (ids: string[]): Promise<void> => {
    await network.updateViewsOrder(ids);
  };

  async addProperty(): Promise<void> {
    const result = await network.addWorkbookProperty(this.currentView);

    const otherViews = this.workbook.views?.filter((p) => p.id !== this.currentView.id);
    otherViews?.forEach((otherView) => otherView.allColumnsInOrder?.push(result.dataField as string));

    this.onPropertyChanged(result);
  }

  async deleteProperty(dataField: string): Promise<void> {
    const result = await network.deleteWorkbookProperty(dataField, this.currentView);
    this.onPropertyChanged(result);
  }

  async updateProperty(column: PropertyDefinition): Promise<void> {
    const result = await network.updateWorkbookProperty(this.workbook.id, column);
    if ((result.status as number) === ResponseStatus.Success) {
      this.workbook.columns = result.collection;
      this.fire(Topics.WorkbookViewChanged);
    }
  }

  async updateRelatedProperty(column: PropertyDefinition): Promise<void> {
    const result = await network.updateRelatedProperty(this.workbook.id, column);
    if ((result.status as number) === ResponseStatus.Success) {
      this.workbook.columns = result.collection;
      this.fire(Topics.WorkbookViewChanged);
    }
  }

  async duplicateProperty(dataField: string): Promise<void> {
    const result = await network.duplicateWorkbookProperty(this.workbook.id, this.currentView.id, dataField);
    this.onPropertyChanged(result);
  }

  async replaceColumnValue(column: PropertyDefinition, oldValue: string, newValue: string): Promise<void> {
    await network.replaceColumnValue(new ReplaceColumnValueCommand({
      workbookId: this.currentWorkbookId.value,
      oldValue,
      newValue,
      propertyId: column.dataField,
    }));
  }
}

export default WorkbookStore;
