<template>
  <Draggable
    style="min-width: 288px"
    v-model="list"
    v-bind="options"
    @start="drag = true"
    @end="onDragEnd"
    item-key="id"
    handle=".handle"
  >
    <template #item="{ element }">
      <div class="focusable-field v-drag-row flex flex-row pl-2">
        <VDragIcon class="handle draggable-icon" />

        <div class="v-hover flex flex-row flex-grow-1">
          <VDivButton
            :style="`height: 29px`"
            :label="element.name"
            :drag="drag"
            class="dark flex-grow-1"
            @click="onSelectView(element)"
          />

          <ViewsListEdit
            :view="element"
            @close-dropdown-event="$emit('closeDropdownEvent')"
            @delete-view-event="onDeleteViewEvent"
            @update-view-name-event="onUpdateViewNameEvent"
          />
        </div>
      </div>
    </template>
  </Draggable>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import Draggable from 'vuedraggable';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import { ViewDefinition } from '@/ts/middleware/web-api';
import { IConfirmationService, IConfirmationServiceOption } from '@/ts/Interfaces';
import ViewsListEdit from './ViewsListEdit.vue';

const emit = defineEmits(['closeDropdownEvent']);

const confirmationService = inject('useConfirm') as IConfirmationService;
const workbookStore = inject('WorkbookStore') as WorkbookStore;
const drag = ref(false);
const list = ref(workbookStore.workbook.views);
const options = computed(() => ({
  animation: 250,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}));

const onSelectView = (view: ViewDefinition) => {
  workbookStore.setView(view);
  emit('closeDropdownEvent');
};

const onDeleteViewEvent = (confirmation: IConfirmationServiceOption) => {
  confirmationService.require(confirmation);
};

const onUpdateViewNameEvent = (a: { id: string; name: string }) => {
  const view = list.value?.find((p) => p.id === a.id);
  if (view) {
    view.name = a.name;
    workbookStore.updateWorkbookView(view);
  }
};

const onDragEnd = () => {
  drag.value = false;
  const viewIds = list.value?.map((p) => p.id || '');
  if (viewIds && viewIds?.length > 0) {
    workbookStore.updateViewsOrder(viewIds);
  }
};
</script>
