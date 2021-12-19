<template>
  <div
    class="pt-2 pb-2"
    style="height: 40px"
  >
    <div class="flex p-ai-baseline">
      <div
        ref="searchDiv"
        contenteditable="true"
        class="single-line pr-2"
        style="cursor: text"
        placeholder="Type to search.."
        @input="onInputChange"
      />
      <VDivButton
        v-if="hasSearch"
        @click="clearSearch"
        :radius="true"
        :small-padding="true"
      >
        <template #before>
          <i class="pi pi-times" />
        </template>
      </VDivButton>
    </div>
  </div>

  <DxSortable
    filter=".dx-treeview-item"
    :allow-drop-inside-item="!hasSearch"
    :allow-reordering="!hasSearch"
    @drag-change="viewModel.onDragChange"
    @drag-end="viewModel.onDragEnd"
  >
    <DxTreeView
      ref="simpleTreeView"
      style="width: 100%"
      :items="viewModel.filteredResult.value"
    >
      <template #item="item">
        <ItemRenderer
          :item="item.data"
          :query="viewModel.searchText.value"
          @add-folder-event="viewModel.addFolder(item.data)"
          @delete-item-event="confirmDelete(item.data)"
          @update-event="viewModel.save"
          @open-file-uploader-event="onOpenFileUploadEvent(item.data)"
          @update-name="onUpdateName(item.data, $event)"
        />
      </template>
    </DxTreeView>
  </DxSortable>
  <FileUploaderDialog
    ref="fileUploaderDialog"
    @item-uploaded-event="onItemUploadedEvent"
    :row-id="rowId"
  />
</template>

<script lang="ts" setup>
import DxTreeView from 'devextreme-vue/tree-view';
import DxSortable from 'devextreme-vue/sortable';
import {
  computed, inject, PropType, ref,
} from 'vue';
import ItemRenderer from './ItemRenderer.vue';
import FileManagerViewModel from '@/ts/viewModels/FileManagerViewModel';
import { IConfirmationService } from '@/ts/Interfaces';
import { getConfirmation } from '@/ts/Confirmations';
import { FileItem } from '@/ts/middleware/web-api';
import FileUploaderDialog from './FileUploaderDialog.vue';

const props = defineProps({
  items: {
    type: Object as PropType<FileItem[]>,
    default() {
      return [];
    },
  },
  rowId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['updateFileItemsEvent']);
const confirmationService = inject('useConfirm') as IConfirmationService;
const simpleTreeView = ref<DxTreeView>();
const viewModel = new FileManagerViewModel(props.items, simpleTreeView, props.rowId);
const fileUploaderDialog = ref();
const userSearchInput = ref();
const searchDiv = ref<HTMLDivElement>();
const hasSearch = computed(() => !!userSearchInput.value);

viewModel.on('updateFileItemsEvent', (payload) => {
  emit('updateFileItemsEvent', payload.data);
});

const confirmDelete = (item: FileItem) => {
  const confirmation = getConfirmation(`Are you sure you want to delete ${item.name}?`, () =>
    viewModel.deleteItem(item));

  confirmationService.require(confirmation);
};

const onItemUploadedEvent = (item: FileItem) => {
  item.expanded = true;
  viewModel.replaceFileItem(item);
};

const onOpenFileUploadEvent = (item: FileItem) => {
  fileUploaderDialog.value.set(item);
  fileUploaderDialog.value.toggle();
};

const onInputChange = (e: Event) => {
  const target = e.target as HTMLDivElement;
  userSearchInput.value = target.innerText;
  viewModel.searchText.value = target.innerText.trim();
};

const clearSearch = () => {
  userSearchInput.value = '';
  const searDivValue = searchDiv.value as HTMLDivElement;
  searDivValue.innerHTML = '';
  viewModel.searchText.value = '';
};

const onUpdateName = (item: FileItem, newName: string) => {
  item.name = newName || 'untitled';
  // viewModel.replaceFileItem(item);
};
</script>

<style lang="scss" scoped>
[contenteditable]:empty:before {
  content: attr(placeholder);
  display: block;
  color: #e1e1e0;
  font-weight: normal;
}
</style>
