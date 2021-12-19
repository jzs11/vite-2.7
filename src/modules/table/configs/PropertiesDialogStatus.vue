<template>
  <VDialogWrapper
    ref="wrapper"
    @close-event="onHide"
  >
    <VColumnStatusConfig :current-column="column" />
  </VDialogWrapper>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import { PropertyDefinition } from '@/ts/middleware/web-api';
import VColumnStatusConfig from '@/components/VColumnStatusConfig.vue';
import WorkbookStore from '@/ts/stores/WorkbookStore';
import VDialogWrapper from '@/components/VDialogWrapper.vue';

const showStatusDialog = ref(false);
const column = ref();
const store = inject('WorkbookStore') as WorkbookStore;
const wrapper = ref();

const toggle = () => {
  wrapper.value.toggle();
};

const set = (value: PropertyDefinition) => {
  column.value = value;
};

const onHide = async () => {
  if (column.value) {
    await store.updateProperty(column.value);
  }
};

defineExpose({
  showStatusDialog,
  toggle,
  set,
});
</script>
