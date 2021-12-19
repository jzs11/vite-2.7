<template>
  <div :class="'card no-gutter widget-overview-box ' + color">
    <span class="overview-icon">
      <i :class="icon" />
    </span>
    <span class="overview-title">{{ label }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  color: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  pending: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Number,
    default: 0,
  },
});
</script>
