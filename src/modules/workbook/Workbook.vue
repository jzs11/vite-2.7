<template>
  <VFullScreenLoadingState v-if="!isReady" />

  <div
    v-else
    class="pt-2"
  >
    <div
      ref="tableContainer"
      class="table-container v-padding-left"
      :style="tableContainerStyle"
    >
      <Table
        ref="table"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, inject, reactive, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useAsyncState, useTitle, useWindowSize } from '@vueuse/core';
import { getBreadcrumbForWorkbook } from '@/ts/utils/BreadcrumbHub';
import VFullScreenLoadingState from '@/components/VFullScreenLoadingState.vue';
import { WorkbookDefinition } from '@/ts/middleware/web-api';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';

import Table from '@/modules/table/TableHello.vue';

const booksStore = inject('WorkbooksStore') as WorkbooksStore;
const route = useRoute();
const isReady = ref(false);
const tableContainer = ref<HTMLDivElement>();
const table = ref();
const dialogState = reactive({
  showDetailFlag: false,
  itemShortId: '',
  currentWorkbookId: '',
  currentViewShortId: '',
});

const updateBreadcrumb = (workbook: WorkbookDefinition) => {
  const breadcrumb = getBreadcrumbForWorkbook(workbook);
  EventBus.emit(Topics.UpdateBreadcrumb, breadcrumb);
};

const def = ref<WorkbookDefinition>(new WorkbookDefinition());

const loadDialog = () => {
  const url = new URLSearchParams(location.search);

  if (url.has('dialog') && url.get('dialog') === 'open') {
    dialogState.showDetailFlag = true;
    dialogState.itemShortId = url.get('itemShortId') as string;
    dialogState.currentWorkbookId = url.get('currentWorkbookId') as string;
    dialogState.currentViewShortId = url.get('viewShortId') as string;
  } else {
    dialogState.showDetailFlag = false;
  }
};

const loadWorkbook = () => {
  isReady.value = false;
  const result = booksStore.getWorkbookById(route.params.id as string).then((payload) => {
    updateBreadcrumb(payload as WorkbookDefinition);
    useTitle(payload.name || '');
    isReady.value = true;
    def.value = payload;

    if (!payload.id) { EventBus.emit(Topics.GoTo404Page); }
  });

  loadDialog();

  return result;
};

watch(
  () => route.params?.id,
  (newValue) => {
    if (newValue) {
      loadWorkbook();
    }
  },
);

watch(
  () => route.query,
  () => {
    loadDialog();
  },
);

useAsyncState(() => loadWorkbook(), null);

const { width } = useWindowSize();

const tableContainerStyle = computed(() => {
  const padding = width.value - 1896;
  if (padding < 0) {
    return 'padding-right: 0px';
  }
  if (padding <= 96) {
    return `padding-right: ${padding}px`;
  }
  return 'padding-right: 96px';
});

</script>
