<template>
  <VDropdown
    class="border"
    :label="selectedLabel"
    overlay-class="workbooks-dropdown"
    ref="workbookDropdown"
  >
    <template #after-label>
      <Icon
        class="ml-2"
        :size="14"
      >
        <ChevronDown color="#6c757d" />
      </Icon>
    </template>

    <div style="width: 440px; height: 360px">
      <div>
        <InputText
          type="text"
          class="workbook-input"
          placeholder="Search for a workbook"
          style="min-width: 390px"
          v-model="search"
        />
      </div>

      <div style="height: 323px; overflow-y: scroll">
        <VDivButton
          v-for="book in workbooks"
          :key="book.id"
          :label="book.name"
          @click="onSelectWorkbook(book)"
        />
      </div>
    </div>
  </VDropdown>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { ChevronDown } from '@vicons/fa';
import { Icon } from '@vicons/utils';
import { useAsyncState } from '@vueuse/core';
import { WorkbookDefinition } from '@/ts/middleware/web-api';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';

const search = ref('');
const workbookDropdown = ref();
const workbooksStore = inject('WorkbooksStore') as WorkbooksStore;
const store = inject('WorkbookStore') as WorkbookStore;
const selectedLabel = ref('Select a workbook');

const { state } = useAsyncState(() => workbooksStore.getSiteWorkbooks(), null);
const emits = defineEmits(['onSelectWorkbookEvent']);

const workbooks = computed(() => {
  const alreadyMappedIds = store.workbook.columns
    ?.filter((p) => p.relatedWorkbookId !== '00000000-0000-0000-0000-000000000000')
    .map((p) => p.relatedWorkbookId);

  const result = state.value
    ?.filter((p) => p.name?.toLowerCase().indexOf(search.value) !== -1)
    .filter((p) => p.id !== store.workbook.id)
    .filter((p) => alreadyMappedIds?.indexOf(p.id) === -1);

  return result;
});

const onSelectWorkbook = (book: WorkbookDefinition) => {
  if (book.id) {
    selectedLabel.value = book.name || '';
    emits('onSelectWorkbookEvent', book.id);
  }
  workbookDropdown.value.toggle();
};
</script>

<style lang="scss" scoped>
.workbook-input {
  width: 100%;
  background-color: #f7f7f5;
  border-radius: 0;
}
</style>
