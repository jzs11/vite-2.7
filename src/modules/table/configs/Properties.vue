<template>
  <Draggable
    style="min-width: 390px"
    v-model="list"
    v-bind="options"
    @start="drag = true"
    @end="onDragEnd"
    item-key="id"
    handle=".handle"
  >
    <template #item="{ element }">
      <div class="focusable-field v-drag-row flex flex-row pl-2 align-items-center">
        <VDragIcon class="handle draggable-icon" />
        <div class="v-hover flex flex-row">
          <PropertyConfig
            @delete-property="onDeleteProperty"
            @duplicate-property="onDuplicateProperty"
            @name-change-event="onNameChangeEvent"
            @column-type-change-event="onColumnTypeChangeEvent"
            @show-in-table-event="onShowInTableEvent"
            :data="element.data"
          />
          <InputSwitch
            :class="'v-switch ml-auto ' + (helper.isTitleColumn(element.data) ? 'p-disabled' : '')"
            v-model="element.selected"
            @click="onInputSwitchClick(element)"
          />
        </div>
      </div>
    </template>
  </Draggable>

  <PropertiesDialogStatus ref="statusDialog" />
  <PropertiesDialogRelation ref="relationDialog" />
</template>

<script lang="ts" setup>
import {
  computed, defineAsyncComponent, inject, ref,
} from 'vue';
import Draggable from 'vuedraggable';
import { Topics } from '@/ts/Enums';
import { IConfirmationService, IConfirmationServiceOption, ITableProperty } from '@/ts/Interfaces';
import { ColumnSetting, PropertyDefinition } from '@/ts/middleware/web-api';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import ColumnTypeHelper from '@/ts/helpers/ColumnTypeHelper';
import PropertyConfig from './PropertyConfig.vue';
import { getConfirmation } from '@/ts/Confirmations';

defineEmits(['closeDropdownEvent']);
const PropertiesDialogStatus = defineAsyncComponent(() => import('./PropertiesDialogStatus.vue'));
const PropertiesDialogRelation = defineAsyncComponent(() => import('./PropertiesDialogRelation.vue'));

const confirmationService = inject('useConfirm') as IConfirmationService;
const drag = ref(false);
const store = inject('WorkbookStore') as WorkbookStore;
const list = ref(store.currentViewProperties);
const helper = new ColumnTypeHelper();
const statusDialog = ref<typeof PropertiesDialogStatus>();
const relationDialog = ref<typeof PropertiesDialogRelation>();

const options = computed(() => ({
  animation: 250,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}));

const onInputSwitchClick = (element: ITableProperty) => {
  const isSelected = !element.selected;
  const result = Array<string>();

  list.value.forEach((p) => {
    if (p.data.dataField === element.data.dataField) {
      if (isSelected) {
        result.push(p.data.dataField || '');
      }
    } else if (p.selected) {
      result.push(p.data.dataField || '');
    }
  });

  store.currentView.columnKeys = result;
  store.updateCurrentView();
  list.value = store.currentViewProperties;
};

const onDragEnd = () => {
  drag.value = false;
  const result = Array<string>();

  list.value.forEach((p) => {
    if (p.data.dataField) {
      result.push(p.data.dataField);
    }
  });

  store.currentView.allColumnsInOrder = result;
  store.updateCurrentView();
  list.value = store.currentViewProperties;
};

store.on(Topics.WorkbookPropertyChanged, () => {
  list.value = store.currentViewProperties;
});

const onNameChangeEvent = async (payload: { column: PropertyDefinition; value: string }) => {
  payload.column.caption = payload.value;
  await store.updateProperty(payload.column);

  list.value.forEach((p) => {
    if (p.data.dataField === payload.column.dataField) {
      p.data.caption = payload.value;
    }
  });
};

const onColumnTypeChangeInner = async (payload: {
  column: PropertyDefinition;
  columnType: number;
  dataType: string;
}, skipUpdate: boolean) => {
  const { column, columnType, dataType } = payload;

  column.columnDataType = columnType;
  column.dataType = dataType;

  if (!skipUpdate) { await store.updateProperty(column); }

  list.value.forEach((p) => {
    if (p.data.dataField === column.dataField) {
      p.data.columnDataType = columnType;
      p.data.dataType = dataType;
    }
  });

  // config the status property
  if (columnType === 6) {
    statusDialog.value?.set(column);
    statusDialog.value?.toggle();
  }

  // config the relation property
  if (columnType === 8) {
    relationDialog.value?.set(column);
    relationDialog.value?.toggle();
  }
};

const onColumnTypeChangeEvent = async (payload: {
  column: PropertyDefinition;
  columnType: number;
  dataType: string;
}) => {
  if (payload.column.columnDataType !== payload.columnType) {
    const type = helper.convertToDisplayByNumber(payload.columnType);
    const confirmation = getConfirmation(
      // eslint-disable-next-line max-len
      `Are you sure you want to change <${payload.column.caption}> to "${type}" type? \n It will remove all existing data from this property.`,
      async () => onColumnTypeChangeInner(payload, false),
    );

    confirmationService.require(confirmation);
  } else {
    await onColumnTypeChangeInner(payload, true);
  }
};

const onDeleteProperty = (confirmation: IConfirmationServiceOption) => {
  confirmationService.require(confirmation);
};

const onDuplicateProperty = async (dataField: string) => {
  await store.duplicateProperty(dataField);
};

const onShowInTableEvent = async (payload: {
  column: PropertyDefinition;
  showInTheTable: boolean;
  columnWidth: number;
  allowEditing: boolean;
}) => {
  // payload.column.showInTheTable = payload.showInTheTable;
  // payload.column.width = payload.columnWidth;
  // payload.column.allowEditing = payload.allowEditing;

  const temp = store.currentView.columnSettings?.filter((p) => p.columnId !== payload.column.dataField) || [];
  temp.push(new ColumnSetting({
    columnId: payload.column.dataField,
    showInTheTable: payload.showInTheTable,
    allowEditing: payload.allowEditing,
    width: payload.columnWidth,
  }));

  store.currentView.columnSettings = temp;
  await store.updateCurrentView();
  // await store.updateProperty(payload.column);
};
</script>
