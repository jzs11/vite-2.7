<template>
  <div
    class="v-chip"
    :style="background"
  >
    <div class="label">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
    default: '',
  },
  color: {
    type: String,
    required: true,
    default: '',
  },
});

const background = computed(() => `background: ${props.color}`);
</script>
