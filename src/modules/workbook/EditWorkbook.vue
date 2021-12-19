<template>
  <VBreadcrumb />
  <div class="edit-content-outter-container">
    <div class="items-details-container">
      <div class="v-item-detail-header dark v-no-padding">
        <div class="flex flex-row ml-auto">
          <Button
            class="ml-auto p-button-danger p-button-outlined"
            label="Delete"
            @click="onDelete"
          />

          <Button
            label="Update"
            class="ml-2"
            @click="save"
          />
        </div>
      </div>
      <div class="items-details-inner-wrapper pt-5">
        <WorkbookModel
          ref="workbookModel"
          :workbook="workbookViewModel"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  inject, onMounted, onUnmounted, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { getBreadcrumb } from '@/ts/utils/BreadcrumbHub';
import router from '@/ts/router';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import WorkbooksStore from '@/ts/stores/WorkbooksStore';
import WorkbookModel from './WorkbookModel.vue';
import { UpdateWorkbookCommand, WorkbookDefinition } from '@/ts/middleware/web-api';
import { getConfirmation } from '@/ts/Confirmations';
import { IConfirmationService } from '@/ts/Interfaces';

const workbookModel = ref();
const workbookViewModel = ref<WorkbookDefinition>();
const store = inject('WorkbooksStore') as WorkbooksStore;
const route = useRoute();
const confirm = useConfirm() as IConfirmationService;

const loadWorkbookModel = async (workbookShortId: string) => {
  const workbooks = await store.allWorkbooks();
  const workbook = workbooks.find((p) => p.shortId === workbookShortId);
  workbookViewModel.value = workbook;

  const breadcrumb = getBreadcrumb([
    {
      label: `Edit  ${workbook?.name}`,
      to: '',
    },
  ]);
  EventBus.emit(Topics.UpdateBreadcrumb, breadcrumb);
};

onMounted(() => {
  loadWorkbookModel(route.params.id as string);
});

const stopWatch = watch(
  () => route.params.id,
  (workbookShortId) => {
    if (workbookShortId) loadWorkbookModel(workbookShortId as string);
  },
);

onUnmounted(() => {
  stopWatch();
});

const save = async () => {
  const raw = workbookModel.value.getModel() as UpdateWorkbookCommand;
  raw.id = workbookViewModel.value?.id || '';
  await store.updateWorkbook(raw);
  router.push(`/${workbookViewModel.value?.shortId}`);
};

const onDelete = async () => {
  const confirmation = getConfirmation(
    `Are you sure you want to delete - ${workbookViewModel.value?.name}?`,
    async () => {
      if (workbookViewModel.value?.id) await store.deleteWorkbook(workbookViewModel.value?.id);
      router.push('/');
    },
    'Danger Zone',
  );

  confirm.require(confirmation);
};
</script>
