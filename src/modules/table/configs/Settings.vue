<template>
  <DropdownLayout>
    <template #top>
      Views for<span class="title">{{ workbook.name }}</span>
    </template>

    <template #middle>
      <ViewsList @close-dropdown-event="onCloseDropdown" />
    </template>

    <template
      v-if="isAdmin"
      #bottom
    >
      <VDropdown
        label="Settings"
        :can-close="false"
        position="right"
      >
        <template #before-label>
          <i class="pi pi-sliders-v pr-2" />
        </template>
        <template #after-label>
          <div class="triangle-point-right ml-auto">
            <VTriangle />
          </div>
        </template>

        <ViewsAdd @close-dropdown-event="onCloseDropdown" />
        <VDivButton
          label="View Permission"
          class="p-button-text"
          @click="emit('openViewAccessEvent')"
        >
          <template #before>
            <i class="pi pi-lock pr-2" />
          </template>
        </VDivButton>
        <VDivButton
          label="Edit Workbook"
          class="p-button-text"
          @click="emit('editWorkbookEvent')"
        >
          <template #before>
            <i class="pi pi-cog pr-2" />
          </template>
        </VDivButton>
      </VDropdown>
    </template>
  </DropdownLayout>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import DropdownLayout from '@/components/VDropdownLayout.vue';
import ViewsList from './ViewsList.vue';
import ViewsAdd from './ViewsAdd.vue';
import { isCurrentWorkbookAdmin } from '@/ts/GlobalState';
import VTriangle from '@/components/svgs/VTriangle.vue';

const isAdmin = ref(isCurrentWorkbookAdmin());
const emit = defineEmits(['closeDropdownEvent', 'openViewAccessEvent', 'editWorkbookEvent']);
const store = inject('WorkbookStore') as WorkbookStore;
const { workbook } = store;
const onCloseDropdown = () => {
  emit('closeDropdownEvent');
};
</script>
