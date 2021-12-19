<template>
  <div class="flex flex-row align-items-center">
    <div v-if="showAddAndRemoveButtons">
      <i
        v-if="linked"
        class="pi pi-minus-circle mr-2 focusable-field v-hover radius-6"
        style="color: #eb5757"
        @click="fireEvent('removeItemEvent')"
        @keydown="()=>{}"
      />

      <i
        v-else
        class="pi pi-plus-circle mr-2 focusable-field v-hover radius-6"
        style="color: #2eaadc"
        @click="fireEvent('addItemEvent')"
        @keydown="()=>{}"
      />
    </div>

    <span class="key-field">
      {{ data.value }}
    </span>

    <VDivButton
      class="header-button ml-auto radius-3 p-shadow-1 border-dark"
      label="OPEN"
      @click="onClick"
    >
      <template #before>
        <VOpenAsPageTick class="mr-1" />
      </template>
    </VDivButton>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, PropType, Ref,
} from 'vue';
import VDivButton from '@/components/VDivButton.vue';
import { ICellData, ICellWrapper } from '@/ts/Interfaces';
import VOpenAsPageTick from '@/components/svgs/VOpenAsPageTick.vue';

const emit = defineEmits(['openItemEvent', 'addItemEvent', 'removeItemEvent']);
const props = defineProps({
  data: {
    type: Object as PropType<ICellData<boolean>>,
    default: null,
  },
  showAddAndRemoveButtons: {
    type: Boolean,
    default: false,
  },
  cellWrapper: {
    type: Object as PropType<Ref<ICellWrapper>>,
    required: false,
    default() {
      return {};
    },

  },
});

const onClick = () => {
  emit('openItemEvent', props.data.key);
};

const fireEvent = (event: 'openItemEvent' | 'addItemEvent' | 'removeItemEvent') => {
  emit(event);
};

const linked = computed(() => {
  if (!props.cellWrapper.value) {
    return false;
  }

  const linkedKeys = props.cellWrapper.value.value
    .toString()
    .split(',')
    .map((p: string) => p.trim());

  return !!linkedKeys.find((p: string) => p === props.data.key);
});
</script>
