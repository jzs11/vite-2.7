<template>
  <div class="grid col-12">
    <div
      class="col-3 md-4 lg-4 workbook-card"
      v-for="item in workbooks.filter((p) => !p.isHidden)"
      :key="item.name"
      @click="goto(item)"
      @keydown="goto(item)"
    >
      <VBrowseCard
        :label="item.name"
        :color="item.color"
        :icon="item.icon"
        :pending="item.pending"
        :completed="item.completed"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { useAsyncState } from '@vueuse/core';
import router from '@/ts/router';
import { WorkbookDefinition } from '@/ts/middleware/web-api';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';
import VBrowseCard from './BrowseCard.vue';

const store = inject('WorkbooksStore') as WorkbooksStore;
const { workbooks } = store;
const { isReady } = useAsyncState(() => store.allWorkbooks(), null);

const goto = (item: WorkbookDefinition): void => {
  router.push(`${item.shortId}`);
};
</script>
