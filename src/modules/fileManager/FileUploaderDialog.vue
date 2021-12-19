<template>
  <VDialogWrapper
    ref="wrapper"
    @close-event="onHide"
  >
    <div
      class="v-padding"
      style="padding: 30px; width: 650px"
    >
      <div style="min-height: 400px">
        <div
          class="v-header"
          v-text="headerLabel"
        />

        <DxFileUploader
          upload-mode="instantly"
          :chunk-size="20000000"
          :max-file-size="104857601"
          :multiple="false"
          :upload-headers="headers"
          :allowed-file-extensions="allowedFileExtensions"
          @upload-error="onError"
          @uploaded="onUploaded"
          @value-changed="addIdParameter"
        />

        <InlineMessage severity="info">
          Note: Maximum file size of 100MB is allowed.
        </InlineMessage>
      </div>

      <div class="flex flex-row mt-auto align-items-center">
        <Button
          label="Close"
          class="p-button-outlined p-button-secondary ml-auto mr-2"
          @click="toggle"
        />
      </div>
    </div>
  </VDialogWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import VDialogWrapper from '@/components/VDialogWrapper.vue';
import { generateGuid } from '@/ts/helpers/Utils';
import { FileItem } from '@/ts/middleware/web-api';
import { getJWT } from '@/ts/GlobalState';

const props = defineProps({
  rowId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['itemUploadedEvent']);
const parentFolder = ref<FileItem>();
const wrapper = ref();
const toggle = () => {
  wrapper.value.toggle();
};
const headerLabel = ref();

const allowedFileExtensions = ref([
  '.doc',
  '.docx',
  '.pdf',
  '.xls',
  '.xlsm',
  '.csv',
  '.txt',
  '.html',
  '.htm',
  '.jpeg',
  '.jpg',
  '.tiff',
  '.bmp',
  '.gif',
  '.png',
  '.mp4',
  '.mov',
  '.wmv',
  '.avi',
]);

const set = (value: FileItem) => {
  parentFolder.value = value;
  headerLabel.value = `Upload file to ${value.name}`;
};

const onHide = async () => {
  headerLabel.value = '';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onError = (e: any) => {
  e.message = `${e.message} - ${e.error.responseText}`;
};

const headers = { Authorization: `Bearer ${getJWT()}` };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onUploaded = (e: any) => {
  const extension = e.request.getResponseHeader('_extension');
  const newFileItem = FileItem.fromJS({
    id: e.request.getResponseHeader('_fileId'),
    extension,
    contentType: e.request.getResponseHeader('_contentType'),
    isDirectory: false,
    name: e.file.name.replace(`.${extension}`, ''),
    size: e.file.size,
    canDelete: true,
    createdOn: new Date(),
  });

  parentFolder.value?.items?.push(newFileItem);

  emit('itemUploadedEvent', parentFolder.value);
  toggle();
};

const updateQueryStringParameter = (uri: string, key: string, value: string) => {
  const regExp = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(regExp)) {
    return uri.replace(regExp, `$1${key}=${value}$2`);
  }
  return `${uri + separator + key}=${value}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addIdParameter = (e: any) => {
  const file = e.value[0];

  // when remove the file from the uploader the file is undefined
  if (!file) return;

  let extension = '';
  const id = generateGuid();
  if (e.value && e.value.length > 0) {
    const strings = e.value[0].name.split('.') as string[];
    if (strings.length > 0) extension = strings[strings.length - 1];
  }

  let url = '/api/storage/upload';
  url = updateQueryStringParameter(url, 'fileId', id);
  url = updateQueryStringParameter(url, 'extension', extension);
  url = updateQueryStringParameter(url, 'rowId', props.rowId);

  e.component.option('uploadUrl', url);
};

defineExpose({
  toggle,
  set,
});
</script>
