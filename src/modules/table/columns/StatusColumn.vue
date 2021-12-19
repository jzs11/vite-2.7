<template>
  <v-chip
    :color="status.color"
    :label="status.name?.toString()"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import VChip from '@/components/VChip.vue';
import { IStatus } from '@/ts/Interfaces';

defineProps({
  status: {
    type: Object as PropType<IStatus>,
    default: () => ({ name: '', color: 'transparent' }),
  },
});
</script>
