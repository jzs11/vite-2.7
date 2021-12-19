<template>
  <Icon :size="18">
    <Folder
      v-if="props.item.isDirectory && !props.item.expanded"
      color="#F5D36E"
    />

    <FolderOpen
      v-else-if="props.item.isDirectory && props.item.expanded"
      color="#F5D36E"
    />

    <FileWord
      v-else-if="'doc,docx'.indexOf(item.extension || '') !== -1"
      color="#07548F"
    />

    <FilePdf
      v-else-if="item.extension === 'pdf'"
      color="#DB544A"
    />

    <FileExcel
      v-else-if="'xls,xlsm'.indexOf(item.extension || '') !== -1"
      color="#1E6E42"
    />

    <FileCsv
      v-else-if="item.extension === 'csv'"
      color="#1E6E42"
    />

    <FileCodeRegular
      v-else-if="'html,htm'.indexOf(item.extension || '') !== -1"
      color="#D93E06"
    />

    <FileImage
      v-else-if="'jpeg,jpg,tiff,bmp,gif,png'.indexOf(item.extension || '') !== -1"
      color="#0FBDCB"
    />

    <FileVideo
      v-else-if="'mp4,mov,wmv,avi'.indexOf(item.extension || '') !== -1"
      color="#F70000"
    />

    <File v-else />
  </Icon>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import {
  Folder,
  FolderOpen,
  File,
  FileWord,
  FilePdf,
  FileExcel,
  FileCsv,
  FileCodeRegular,
  FileImage,
  FileVideo,
} from '@vicons/fa';
import { Icon } from '@vicons/utils';
import { FileItem } from '@/ts/middleware/web-api';

const props = defineProps({
  item: {
    type: Object as PropType<FileItem>,
    required: true,
  },
});
</script>
