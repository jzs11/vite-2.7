<template>
  <VDropdownLayout>
    <template #top>
      Properties For<span class="title dark">{{ currentView.name }}</span>
    </template>

    <template #middle>
      <div class="scroll-panel">
        <VPropertiesList />
      </div>
    </template>

    <template #bottom>
      <VPropertiesAdd />
    </template>
  </VDropdownLayout>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import VDropdownLayout from '@/components/VDropdownLayout.vue';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import VPropertiesList from './Properties.vue';
import VPropertiesAdd from './PropertiesAdd.vue';

defineEmits(['closeDropdownEvent']);

const store = inject('WorkbookStore') as WorkbookStore;
const { currentView } = store;
</script>

<style lang="scss" scoped>
.scroll-panel {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
