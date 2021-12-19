<template>
  <div
    class="focusable-field v-div-button flex flex-row  p-ripple"
    :class="[
      radius ? 'radius-3' : '',
      disabled ? 'p-disabled' : '',
      enableHover ? 'v-hover' : '',
      smallPadding ? 'v-div-button-sm-padding' : '',
    ]"
    v-ripple
    :style="style"
    @mouseover="hover = true"
    @focus="hover = true"
    @mouseleave="hover = false"
    @blur="hover = false"
  >
    <slot name="before" />

    <div
      class="label"
      :title="title || label"
      v-text="label"
    />

    <slot />

    <slot
      v-if="slotAfterVisible"
      name="after"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: false,
    default: '',
  },
  style: {
    type: String,
    required: false,
    default: '',
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  radius: {
    type: Boolean,
    default: false,
  },
  hoverToShowSlotAfter: {
    type: Boolean,
    default: false,
  },
  smallPadding: {
    type: Boolean,
    default: false,
  },
  enableHover: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
});

const hover = ref(false);

const slotAfterVisible = computed(() => {
  if (!props.hoverToShowSlotAfter) return true;

  return hover.value;
});
</script>
