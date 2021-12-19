<template>
  <VDivButton
    label="Add a property"
    class="p-button p-button-text"
    @click="onCreate"
  >
    <template #before>
      <i class="pi pi-plus pr-2" />
    </template>
  </VDivButton>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import WorkbookStore from '@/ts/stores/WorkbookStore';

const store = inject('WorkbookStore') as WorkbookStore;

const onCreate = () => {
  store.addProperty();
};
</script>
