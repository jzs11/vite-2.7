<template>
  <div
    class="flex-column v-dropdown"
    :style="style"
  >
    <div
      v-if="hasTitle"
      class="none-select pt-3 pr-3 pl-3"
    >
      <slot name="top" />
    </div>

    <div
      v-if="hasContent"
      class="pt-3 pb-3"
    >
      <slot name="middle" />
    </div>

    <div
      v-if="hasAction"
      class="border-top pt-2 pb-2 "
    >
      <slot name="bottom" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  hasTitle: {
    type: Boolean,
    default: true,
  },
  hasContent: {
    type: Boolean,
    default: true,
  },
  hasAction: {
    type: Boolean,
    default: true,
  },
  style: {
    type: Object,
    default: null,
    required: false,
  },
});
</script>
