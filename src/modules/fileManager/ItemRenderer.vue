<template>
  <div
    class="item-renderer flex align-items-center"
    style="height: 26px; width: 100%"
  >
    <ExtensionIcon :item="item" />

    <WordHighlighter
      class="pl-2 fileName"
      :query="query"
      :split-by-space="true"
      :text-to-highlight="name"
    />

    <span
      class="dx-fileuploader-file-size"
      v-text="size"
    />

    <ConfigDropdown
      class="ml-auto config-dropdown"
      :item="item"
      @add-folder-event="emit('addFolderEvent')"
      @delete-item-event="emit('deleteItemEvent')"
      @update-event="emit('updateEvent')"
      @open-file-uploader-event="emit('openFileUploaderEvent')"
      @update-name="onUpdateName"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import WordHighlighter from 'vue-word-highlighter';
import { FileItem } from '@/ts/middleware/web-api';
import ConfigDropdown from './ConfigDropdown.vue';
import ExtensionIcon from './ExtensionIcon.vue';
import { formatBytes } from '@/ts/helpers/Utils';

const emit = defineEmits(['deleteItemEvent', 'addFolderEvent', 'updateEvent', 'openFileUploaderEvent', 'updateName']);
const props = defineProps({
  item: {
    type: Object as PropType<FileItem>,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
});

const name = computed(() => props.item.name || 'Untitled');
const size = computed(() => (props.item.isDirectory ? '' : formatBytes(props.item.size || 0)));

const onUpdateName = (newName: string) => {
  emit('updateName', newName);
};
</script>

<style lang="scss">
.fileName {
  display: inline-block;
  max-width: 350px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  mark {
    padding: 0;
    background-color: yellow;
  }
}
.config-dropdown {
  opacity: 0.5;
  transition: opacity 0.25s ease-in-out;
  -moz-transition: opacity 0.25s ease-in-out;
  -webkit-transition: opacity 0.25s ease-in-out;
}
.item-renderer {
  &:hover {
    .config-dropdown {
      opacity: 1;
      transition: opacity 0.25s ease-in-out;
      -moz-transition: opacity 0.25s ease-in-out;
      -webkit-transition: opacity 0.25s ease-in-out;
    }
  }
}
</style>
