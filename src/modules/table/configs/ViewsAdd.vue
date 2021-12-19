<template>
  <VDropdown
    label="New View"
    class="p-button-text"
    @open-event="onOpenEvent"
  >
    <template #before-label>
      <i class="pi pi-plus pr-2 " />
    </template>

    <div
      class="flex-column"
      style="width: 280px"
    >
      <div class="none-select pt-3 pr-3 pl-3">
        <InputText
          ref="inputText"
          v-model="name"
          style="width: 100%"
          placeholder="View name"
        />
      </div>

      <div class="p-3">
        <Button
          label="Create"
          style="width: 100%"
          @click="onCreate"
        />
      </div>
    </div>
  </VDropdown>
</template>

<script lang="ts" setup>
import { inject, nextTick, ref } from 'vue';
import WorkbookStore from '@/ts/stores/WorkbookStore';

const emit = defineEmits(['closeDropdownEvent']);

const store = inject('WorkbookStore') as WorkbookStore;
const name = ref<string>();
const inputText = ref();

const onOpenEvent = () => {
  nextTick(() => {
    inputText.value?.$el.focus();
  });
};

const onCreate = () => {
  store.createView(name.value || '');
  emit('closeDropdownEvent');
};
</script>
