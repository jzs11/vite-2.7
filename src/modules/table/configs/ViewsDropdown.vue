<template>
  <div @click="onClickDropdown">
    <VDropdown
      ref="dropdown"
      :label="store.currentViewName.value"
      class="dark"
      :can-close="false"
    >
      <template #before-label>
        <i class="pi pi-table pr-2" />
      </template>

      <template #after-label>
        <Icon
          class="ml-2"
          :size="10"
        >
          <ChevronDown color="#37352F" />
        </Icon>
      </template>

      <Settings
        class="content"
        @close-dropdown-event="onCloseDropdown"
        @open-view-access-event="onOpenViewAccessEvent"
        @edit-workbook-event="onEditWorkbookEvent"
      />
    </VDropdown>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import { ChevronDown } from '@vicons/fa';
import { Icon } from '@vicons/utils';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import Settings from './Settings.vue';
import router from '@/ts/router';

const emit = defineEmits(['openViewAccessEvent']);
const dropdown = ref();
const onCloseDropdown = () => {
  dropdown.value?.toggle();
};
const store = inject('WorkbookStore') as WorkbookStore;

const onClickDropdown = () => {
  EventBus.emit(Topics.ClosePropertyDropdown);
};

const onOpenViewAccessEvent = () => {
  onCloseDropdown();
  emit('openViewAccessEvent');
};

const onEditWorkbookEvent = () => {
  router.push(`/edit/${store.currentWorkbookShortId.value}`);
};
</script>

<style lang="scss" scoped>
.content {
  border-radius: 3px;
  background: white;
  position: relative;
  max-width: calc(100vw - 24px);
  box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px;
  overflow: hidden;
}
</style>
