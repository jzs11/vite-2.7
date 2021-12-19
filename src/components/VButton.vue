<template>
  <Button
    :label="label"
    :loading="loading"
    type="submit"
  />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';

defineProps({
  label: {
    type: String,
    required: true,
  },
});

const loading = ref(false);
const ajaxStart = () => { loading.value = true; };
const ajaxStop = () => { loading.value = false; };

onMounted(() => {
  EventBus.on(Topics.AjaxStart, ajaxStart);
  EventBus.on(Topics.AjaxStop, ajaxStop);
});

onUnmounted(() => {
  EventBus.off(Topics.AjaxStart, ajaxStart);
  EventBus.off(Topics.AjaxStop, ajaxStop);
});
</script>
