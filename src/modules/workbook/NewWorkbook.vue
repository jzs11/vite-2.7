<template>
  <VBreadcrumb />
  <div class="edit-content-outter-container">
    <div class="items-details-container">
      <div class="v-item-detail-header dark v-no-padding">
        <div class="flex flex-row ml-auto">
          <Button
            label="Create"
            class="ml-2"
            @click="save"
          />
        </div>
      </div>
      <div class="items-details-inner-wrapper pt-5">
        <WorkbookModel ref="workbookModel" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { getBreadcrumb } from '@/ts/utils/BreadcrumbHub';
import router from '@/ts/router';
import Paths from '@/ts/router/map';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';
import WorkbookModel from './WorkbookModel.vue';

const workbookModel = ref();

onMounted(() => {
  const breadcrumb = getBreadcrumb([
    {
      label: 'New Workbook',
      to: Paths.WorkbooksNew,
    },
  ]);
  EventBus.emit(Topics.UpdateBreadcrumb, breadcrumb);
});

const store = inject('WorkbooksStore') as WorkbooksStore;

const save = async () => {
  const raw = workbookModel.value.getModel();

  const id = await store.createWorkbook(raw);
  if (id) {
    router.push(`${raw.shortId}`);
  }
};
</script>
