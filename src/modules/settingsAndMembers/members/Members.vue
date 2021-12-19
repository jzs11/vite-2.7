<template>
  <div
    class="header-des pb-4"
    tabindex="-1"
  >
    Manage members here for your workspace.
  </div>

  <div class="pb-3">
    <Button
      label="Add members"
      @click="toggle"
    />
    <OverlayPanel
      ref="overlayPanel"
      class="v-overlay-panel"
    >
      <AddMembers @close-drop-down="onCloseDropDown" />
    </OverlayPanel>
  </div>

  <DxDataGrid
    :show-borders="false"
    :width="640"
    :row-alternation-enabled="true"
    :data-source="members"
    @row-updated="onRowUpdating"
    @row-removed="onRowRemoved"
    key-expr="userEmail"
  >
    <DxEditing
      :allow-updating="true"
      :allow-deleting="true"
      :allow-adding="false"
      mode="row"
    />

    <DxHeaderFilter
      :visible="true"
      :allow-search="true"
    />

    <DxSorting mode="none" />
    <DxScrolling mode="virtual" />
    <DxColumn
      :width="380"
      data-field="userEmail"
      :allow-editing="false"
      caption="User"
    />
    <DxColumn
      :width="122"
      data-field="accessLevel"
      caption="Access level"
    >
      <DxLookup
        :data-source="accessLevels"
        display-expr="name"
        value-expr="value"
      />
    </DxColumn>
  </DxDataGrid>
</template>

<script lang="ts" setup>
import {
  inject, onMounted, ref, toRaw,
} from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxScrolling,
  DxSorting,
  DxHeaderFilter,
  DxLookup,
  DxEditing,
} from 'devextreme-vue/data-grid';
import { useAsyncState } from '@vueuse/core';
import WorkspaceStore from '@/ts/stores/WorkspaceStore';
import Members from '@/ts/viewModels/Members';
import { IEditingEvent } from '@/ts/Interfaces';
import AddMembers from './AddMembers.vue';
import { success } from '@/ts/utils/ToastHelpers';

const viewModel = new Members();
const store = inject('WorkspaceStore') as WorkspaceStore;
useAsyncState(() => store.loadMembers(), null);

const { members } = store;
const accessLevels = ref(viewModel.accessLevels);
const overlayPanel = ref();

const onRowUpdating = (event: IEditingEvent) => {
  store.updateMember(toRaw(event.data));
};
const onRowRemoved = (event: IEditingEvent) => {
  store.deleteMember(toRaw(event.data));
};

const toggle = (event: MouseEvent) => {
  overlayPanel.value.toggle(event);
};

const onCloseDropDown = () => {
  toggle(new MouseEvent(''));
  store.loadMembers();
  success('User(s) added to the workspace.');
};

onMounted(async () => {
  await store.loadMembers();
});
</script>

<style lang="scss" scoped>
.header {
  color: rgb(55, 53, 47);
  border-bottom: 0px;
  margin-bottom: 8px;
  padding-bottom: 0px;
  font-size: 14px;
  font-weight: 400;
  width: auto;
}
</style>
