<template>
  <div :class="className">
    <div style="height: 20px; width: 40px">
      <VLoading
        :height="30"
        :width="30"
        color="#E8E7E4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VLoading from '@/components/svgs/VLoading.vue';

defineProps({
  className: {
    type: String,
    default: 'v-center',
  },
});
</script>
