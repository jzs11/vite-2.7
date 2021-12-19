<template>
  <VDropdown
    ref="dropdown"
    label="Properties"
    :can-close="false"
  >
    <Properties />
  </VDropdown>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Topics } from '@/ts/Enums';
import EventBus from '@/ts/utils/EventBus';
import Properties from './PropertiesLayout.vue';

const dropdown = ref();

const onClosePropertyDropdown = () => {
  dropdown?.value?.hide();
};

onMounted(() => {
  EventBus.on(Topics.ClosePropertyDropdown, onClosePropertyDropdown);
});

onUnmounted(() => {
  EventBus.off(Topics.ClosePropertyDropdown, onClosePropertyDropdown);
});
</script>
