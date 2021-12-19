<template>
  <router-view :key="$route.path" />
</template>

<script lang="ts" setup>
import {
  onMounted,
  onUnmounted,
  provide, ref,
} from 'vue';
import { useStorage } from '@vueuse/core';
import { delay } from 'lodash';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';
import { setRefreshTokenTimer } from '@/ts/stores/RefreshToken';
import registerHotkeys from '@/ts/helpers/HotKeys';

registerHotkeys();
const store = new WorkbooksStore();

provide('WorkbooksStore', store);

setRefreshTokenTimer();
const hideLeftPanel = useStorage(Topics.HideLeftPanel, false);
const hidingLeftPanel = ref(false);

const onHideLeftPanel = (payload: unknown): void => {
  const temp = payload as boolean;
  hidingLeftPanel.value = temp;

  if (temp) { delay(() => { hideLeftPanel.value = temp; }, 300); } else { hideLeftPanel.value = temp; }
};

onMounted(() => {
  EventBus.on(Topics.HideLeftPanel, onHideLeftPanel);
});

onUnmounted(() => {
  EventBus.off(Topics.HideLeftPanel, onHideLeftPanel);
});

</script>
