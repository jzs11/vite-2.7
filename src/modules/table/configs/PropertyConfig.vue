<template>
  <VDropdown
    ref="dropdown"
    :label="data.caption"
    :style="`width: 370px; height: 29px`"
    class="dark"
    @open-event="onDropdownOpen"
  >
    <template #before-label>
      <div class="pr-2">
        <VPropertyIcon :column="data" />
      </div>
    </template>

    <VDropdownLayout>
      <template #top>
        <InputText
          ref="nameInput"
          v-model="name"
          style="width: 220px"
          placeholder="Property name"
          @change="onNameChangeEvent"
        />
      </template>

      <template #middle>
        <div class="font-light-uppercase">
          Property Type
        </div>

        <VDivButton
          v-tooltip="`The Name column is used as the title of each page and it can not be changed.`"
          v-if="helper.isTitleColumn(data)"
          label="Title"
        >
          <template #before>
            <VPropertyIcon
              classes="pr-3"
              :is-title="true"
            />
          </template>
        </VDivButton>
        <VPropertySelector
          v-else
          :data="data"
          @column-type-change-event="onColumnTypeChangeEvent"
        />

        <div class="pt-3 border-top font-light-uppercase">
          For view - {{ store.currentView.name }}
        </div>

        <!-- Show in table field -->
        <div
          class="focusable-field flex flex-row pl-3 align-items-center font-500"
          style="height: 29px"
        >
          <i class="pi pi-eye" />
          <div class="pl-3">
            Show in table
          </div>

          <div class="ml-auto">
            <InputSwitch
              class="v-switch"
              v-model="showInTable"
            />
          </div>
        </div>

        <!-- Readonly field -->
        <div
          class="focusable-field flex flex-row pl-3 align-items-center font-500"
          style="height: 29px"
        >
          <i class="pi pi-pencil" />
          <div class="pl-3">
            Editable
          </div>

          <div class="ml-auto">
            <InputSwitch
              class="v-switch"
              v-model="allowEditing"
            />
          </div>
        </div>

        <!-- column width -->
        <div
          class="focusable-field pt-2 flex flex-row pl-3 align-items-center font-500"
          style="height: 29px"
        >
          <i class="pi pi-minus" />
          <div class="pl-3">
            Width
          </div>

          <div class="p-field ml-auto">
            <InputNumber
              v-model="columnWidth"
              mode="decimal"
              show-buttons
              :min="50"
              :max="500"
              :step="5"
              class="column-width-input"
            />
          </div>
        </div>
      </template>

      <template
        v-if="!helper.isTitleColumn(data)"
        #bottom
      >
        <VDivButton
          label="Duplicate"
          @click="onDuplicate"
        >
          <template #before>
            <i class="pi pi-copy pr-3" />
          </template>
        </VDivButton>
        <VDivButton
          label="Delete"
          @click="onDelete"
        >
          <template #before>
            <i class="pi pi-trash pr-3" />
          </template>
        </VDivButton>
      </template>
    </VDropdownLayout>
  </VDropdown>
</template>

<script lang="ts" setup>
import {
  PropType, ref, nextTick, watch, inject,
} from 'vue';
import { useDebounce } from '@vueuse/core';
import { PropertyDefinition } from '@/ts/middleware/web-api';
import ColumnTypeHelper from '@/ts/helpers/ColumnTypeHelper';
import VPropertyIcon from '@/components/svgs/VPropertyIcon.vue';
import { getConfirmation } from '@/ts/Confirmations';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import VDropdown from '@/components/VDropdown.vue';
import VDivButton from '@/components/VDivButton.vue';
import VPropertySelector from './PropertyConfigSelector.vue';

const emit = defineEmits([
  'nameChangeEvent',
  'deleteProperty',
  'duplicateProperty',
  'columnTypeChangeEvent',
  'showInTableEvent',
]);
const props = defineProps({
  data: {
    type: Object as PropType<PropertyDefinition>,
    required: true,
  },
});

const name = ref(props.data.caption);
const helper = new ColumnTypeHelper();
const store = inject('WorkbookStore') as WorkbookStore;
const dropdown = ref();
const nameInput = ref();
const showInTable = ref(store.getColumnShowInTable(props.data));
const allowEditing = ref(store.getColumnAllowEditing(props.data));
const columnWidth = ref(store.getColumnWidth(props.data));
const debouncedColumnWidth = useDebounce(columnWidth, 400);

const onNameChangeEvent = () => {
  emit('nameChangeEvent', { column: props.data, value: name.value });
};

const onColumnTypeChangeEvent = (payload: { columnType: number; dataType: string }) => {
  emit('columnTypeChangeEvent', { ...payload, ...{ column: props.data } });
  dropdown.value?.toggle();
};

const onDuplicate = () => {
  if (!props.data.dataField) {
    return;
  }
  dropdown.value?.toggle();
  emit('duplicateProperty', props.data.dataField);
};

const onDelete = () => {
  if (!props.data.dataField) return;

  const confirmation = getConfirmation(`Are you sure you want to delete - ${props.data.caption}?`, () =>
    store.deleteProperty(props.data.dataField || ''));

  emit('deleteProperty', confirmation);
};

const onDropdownOpen = () => {
  nextTick(() => {
    const input = nameInput?.value?.$el as HTMLInputElement;
    input.select();
    input.focus();
  });
};

watch([showInTable, debouncedColumnWidth, allowEditing], ([newShowInTable, newColumnWidth, newAllowEditing]) => {
  emit('showInTableEvent', {
    ...{ column: props.data },
    ...{ showInTheTable: newShowInTable },
    ...{ columnWidth: newColumnWidth },
    ...{ allowEditing: newAllowEditing },
  });
});
</script>
