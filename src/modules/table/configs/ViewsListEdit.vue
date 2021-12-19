<template>
  <VDropdown @open-event="onDropdownOpen">
    <template #before-label>
      <VEllipsisH />
    </template>

    <VDropdownLayout :has-content="false">
      <template #top>
        <InputText
          style="width: 280px"
          class="mb-3"
          placeholder="View name"
          v-model="name"
          ref="nameInput"
          @keyup.prevent.enter="emit('closeDropdownEvent')"
        />
      </template>

      <template #bottom>
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
  inject, nextTick, PropType, ref,
} from 'vue';
import { debouncedWatch } from '@vueuse/core';
import VDivButton from '@/components/VDivButton.vue';
import { ViewDefinition } from '@/ts/middleware/web-api';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import { warn } from '@/ts/utils/ToastHelpers';
import { getConfirmation } from '@/ts/Confirmations';
import VEllipsisH from '@/components/svgs/VEllipsisH.vue';

const emit = defineEmits(['closeDropdownEvent', 'deleteViewEvent', 'updateViewNameEvent']);
const props = defineProps({
  view: {
    type: Object as PropType<ViewDefinition>,
    required: true,
  },
});

const store = inject('WorkbookStore') as WorkbookStore;
const name = ref(props.view.name);
const onDelete = () => {
  emit('closeDropdownEvent');
  if (store.workbook.views?.length === 1) {
    warn('We can not remove the last view for this workbook.');
    return;
  }

  if (props.view.isSystem) {
    warn('We can not remove the default view for this workbook.');
    return;
  }

  const confirmation = getConfirmation(`Are you sure you want to delete - ${props.view.name}?`, () =>
    store.deleteView(props.view));

  emit('deleteViewEvent', confirmation);
};
const onDuplicate = () => {
  store.duplicateView(props.view);
  emit('closeDropdownEvent');
};

debouncedWatch(
  () => name.value,
  async (newValue) => {
    emit('updateViewNameEvent', { id: props.view.id, name: newValue });
  },
  { debounce: 400 },
);

const nameInput = ref();
const onDropdownOpen = () => {
  nextTick(() => {
    const input = nameInput?.value?.$el as HTMLInputElement;
    input.select();
    input.focus();
  });
};
</script>
