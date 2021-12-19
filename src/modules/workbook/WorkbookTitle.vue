<template>
  <div class="flex flex-row table-title align-items-center">
    <span class="table-title-overview-icon"><i :class="workbookDefinition.icon" /></span>
    <VEditableDiv
      :data="workbookDefinition.name"
      class="v-editable-header pr-2"
      @value-changed="updateName"
      :is-editable="isCurrentWorkbookAdmin()"
    />
  </div>
</template>

<script lang="ts" setup>
import { inject, PropType } from 'vue';
import { useTitle } from '@vueuse/core';
import { getBreadcrumbForWorkbook } from '@/ts/utils/BreadcrumbHub';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import VEditableDiv from '@/components/VEditableDiv.vue';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';
import { WorkbookDefinition } from '@/ts/middleware/web-api';
import { isCurrentWorkbookAdmin } from '@/ts/GlobalState';

const props = defineProps({
  workbookDefinition: {
    type: Object as PropType<WorkbookDefinition>,
    required: true,
  },
});

const workbooksStore = inject('WorkbooksStore') as WorkbooksStore;

const updateName = async (value: string): Promise<void> => {
  const store = new WorkbookStore(props.workbookDefinition);
  store.workbook.name = value;
  EventBus.emit(Topics.UpdateBreadcrumb, getBreadcrumbForWorkbook(store.workbook));
  useTitle(value);
  workbooksStore.updateSingleWorkbook(await store.updateWorkbook());
};
</script>
