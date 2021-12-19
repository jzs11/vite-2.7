<template>
  <VDropdown ref="dropdown">
    <template #before-label>
      <VEllipsisH />
    </template>

    <VDropdownLayout :has-content="false">
      <template #top>
        <InputText
          style="width: 280px"
          class="mb-3"
          placeholder="Folder name"
          v-model="name"
          ref="nameInput"
          @keyup.enter="onEnter"
          :title="name"
        />

        <div
          v-if="false"
          class="flex pl-1 mb-2 header-des"
          v-text="timeAgo"
        />
      </template>

      <template #bottom>
        <VDivButton
          label="File Upload..."
          v-if="item.isDirectory"
          @click="emit('openFileUploaderEvent')"
        >
          <template #before>
            <i class="pi pi-upload pr-3" />
          </template>
        </VDivButton>
        <VDivButton
          label="New Folder"
          v-if="item.isDirectory"
          @click="emit('addFolderEvent')"
        >
          <template #before>
            <i class="pi pi-plus pr-3" />
          </template>
        </VDivButton>

        <VDivButton
          label="Download"
          v-if="!item.isDirectory && !isDownloading"
          @click="onDownload"
        >
          <template #before>
            <i class="pi pi-download pr-3" />
            <ProgressBar :value="percentage" />
          </template>
        </VDivButton>

        <VDivButton
          label="Preview"
          v-if="!item.isDirectory && !isDownloading && item.extension === 'pdf'"
          @click="onPreview"
        >
          <template #before>
            <i class="pi pi-external-link pr-3" />
            <ProgressBar :value="percentage" />
          </template>
        </VDivButton>

        <ProgressBar
          v-if="isDownloading"
          class="m-1"
          :value="percentage"
        />

        <VDivButton
          label="Delete"
          v-if="item.canDelete"
          @click="emit('deleteItemEvent')"
        >
          <template #before>
            <i class="pi pi-trash pr-3" />
          </template>
        </VDivButton>
      </template>
    </VDropdownLayout>
  </VDropdown>
</template>

<script lang="ts" setup>
import {
  computed, PropType, ref, watch,
} from 'vue';
import ProgressBar from 'primevue/progressbar';
import { FileItem } from '@/ts/middleware/web-api';
import FileDownloader from '@/ts/middleware/FileDownloader';
import VEllipsisH from '@/components/svgs/VEllipsisH.vue';

const props = defineProps({
  item: {
    type: Object as PropType<FileItem>,
    required: true,
  },
});

const emit = defineEmits(['deleteItemEvent', 'addFolderEvent', 'updateEvent', 'openFileUploaderEvent', 'updateName']);
const nameInput = ref();
const name = ref(props.item.name);
const dropdown = ref();
const timeAgo = computed(() => `Uploaded on ${props.item.createdOn?.toLocaleString()}`);

const isDownloading = ref(false);
const percentage = ref(0);
const onDownload = () => {
  const downloader = new FileDownloader(props.item);

  downloader.on('percentage', (event) => {
    percentage.value = event.data as number;
  });
  downloader.on('start', () => {
    isDownloading.value = true;
  });
  downloader.on('finish', () => {
    isDownloading.value = false;
    percentage.value = 0;
  });

  downloader.download();
};

const onPreview = () => {
  const downloader = new FileDownloader(props.item);

  downloader.on('percentage', (event) => {
    percentage.value = event.data as number;
  });
  downloader.on('start', () => {
    isDownloading.value = true;
  });
  downloader.on('finish', () => {
    isDownloading.value = false;
    percentage.value = 0;
  });

  downloader.preview();
};

watch(
  () => name.value,
  (newValue) => {
    emit('updateName', newValue);
  },
);

const onEnter = () => {
  dropdown.value.hide();
  emit('updateEvent');
};
</script>
