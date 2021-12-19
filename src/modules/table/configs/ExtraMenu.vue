<template>
  <div @click="onClickDropdown">
    <VDropdown>
      <template #before-label>
        <VEllipsisH />
      </template>

      <div
        style="width: 220px"
        class="pt-2 pb-2"
      >
        <VDivButton
          label="Delete"
          :disabled="!selected"
          @click="tableViewModel.onDelete()"
        />
      </div>
      <div
        class="border-top pt-2 pb-2"
        @click="onClickWrapCell()"
      >
        <div class="focusable-field v-drag-row flex flex-row pl-3 pr-1 align-items-center v-hover">
          <div :style="{ fontWeight: 500 }">
            Wrap cells
          </div>
          <InputSwitch
            class="v-switch ml-auto mb-1"
            v-model="tableViewModel.wrapCellInStorage.value"
            @click.prevent="onInputSwitch($event)"
          />
        </div>
      </div>
    </VDropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { Topics } from '@/ts/Enums';
import EventBus from '@/ts/utils/EventBus';
import TableViewModel from '@/ts/viewModels/TableViewModel';
import VEllipsisH from '@/components/svgs/VEllipsisH.vue';

const tableViewModel = inject('TableViewModel') as TableViewModel;
const selected = computed(() => !!tableViewModel?.selectedItemKey.value);

const onClickDropdown = () => {
  EventBus.emit(Topics.ClosePropertyDropdown);
};

const onClickWrapCell = () => {
  tableViewModel.toggleWrapCell();
};

const onInputSwitch = (event: Event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
};
</script>
