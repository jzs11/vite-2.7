<template>
  <Dialog
    :draggable="false"
    :modal="true"
    :dismissable-mask="true"
    :show-header="false"
    v-model:visible="visible"
    content-class="v-dialog-container v-no-padding"
    @hide="onHide"
  >
    <slot />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['closeEvent']);
const visible = ref(false);

const toggle = () => {
  visible.value = !visible.value;
};

const onHide = () => {
  emit('closeEvent');
};

defineExpose({ toggle, visible });
</script>
