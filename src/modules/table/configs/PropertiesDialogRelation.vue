<template>
  <VDialogWrapper ref="wrapper">
    <div
      class="v-padding"
      style="padding: 30px; width: 550px"
    >
      <div
        class="v-header"
        v-text="headerLabel"
      />

      <div class="pb-5">
        <div
          class="pb-3"
          v-if="!isUpdateExistingRelationProperty"
        >
          <div class="pb-2">
            A relation allows you to link tables from other workbooks.
          </div>

          <WorkbookSelector @on-select-workbook-event="onSelectWorkbook" />
        </div>

        <TableCellConfig
          ref="tableCellConfig"
          :property-definition="column"
          :workbook="currentLinkedWorkbook"
        />
      </div>

      <div class="flex flex-row align-items-center">
        <Button
          label="Cancel"
          class="p-button-outlined p-button-secondary ml-auto mr-2"
          @click="toggle"
        />
        <Button
          :label="saveButtonLabel"
          :disabled="!canSave"
          @click="onSave"
        />
      </div>
    </div>
  </VDialogWrapper>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { PropertyDefinition, WorkbookDefinition } from '@/ts/middleware/web-api';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';
import VDialogWrapper from '@/components/VDialogWrapper.vue';
import WorkbookSelector from './PropertiesDialogRelationWorkbookSelector.vue';
import TableCellConfig from './PropertiesDialogRelationCellConfig.vue';

const wrapper = ref();
const selectedId = ref();
const column = ref<PropertyDefinition>();
const workbooksStore = inject('WorkbooksStore') as WorkbooksStore;
const store = inject('WorkbookStore') as WorkbookStore;
const tableCellConfig = ref<typeof TableCellConfig>();

const { state } = useAsyncState(() => workbooksStore.getSiteWorkbooks(), null);

const toggle = () => {
  wrapper.value.toggle();
};

const isUpdateExistingRelationProperty = ref(true);
const currentLinkedWorkbook = ref(new WorkbookDefinition());

const headerLabel = ref('Create Relation');
const set = (value: PropertyDefinition) => {
  selectedId.value = value.relatedWorkbookId;
  // eslint-disable-next-line max-len
  isUpdateExistingRelationProperty.value = value.relatedWorkbookId !== '00000000-0000-0000-0000-000000000000' && !!value.relatedWorkbookId;
  column.value = value;
  // eslint-disable-next-line max-len
  currentLinkedWorkbook.value = state.value?.find((p) => p.id === column.value?.relatedWorkbookId) || new WorkbookDefinition();
  if (currentLinkedWorkbook.value) {
    headerLabel.value = `This property is linked with workbook ${currentLinkedWorkbook.value.name}`;
  }
};

const saveButtonLabel = computed(() =>
  (isUpdateExistingRelationProperty.value ? 'Update Relation' : 'Create Relation'));

const canSave = computed(() => {
  if (isUpdateExistingRelationProperty.value) return true;
  if (selectedId.value) return true;
  return false;
});

const onSave = async () => {
  if (column.value) {
    if (tableCellConfig.value) {
      const { displayType, statusColumnKey, hideNameField } = tableCellConfig.value.getModel();
      column.value.relatedPropertyDisplayType = displayType;
      column.value.relatedPropertyAppendedStatusPropertyKey = statusColumnKey;
      column.value.hideTheRelatedPropertyNameField = hideNameField;
    }

    column.value.relatedWorkbookId = selectedId.value;

    await store.updateProperty(column.value);
  }
  toggle();
};

const onSelectWorkbook = (id: string) => {
  selectedId.value = id;
  currentLinkedWorkbook.value = state.value?.find((p) => p.id === id) || new WorkbookDefinition();
};

defineExpose({ set, toggle });
</script>
