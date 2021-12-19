<template>
  <VDialogWrapper ref="wrapper">
    <div
      class="v-padding"
      style="padding: 30px; width:550px"
    >
      <div class="v-header">
        Let's configure who can access: {{ store.workbook.name }}
      </div>

      <Dropdown
        class="dropdown"
        :options="store.workbook.views"
        option-label="name"
        option-value="id"
        placeholder="Select a View"
        v-model="viewModel.selectViewId.value"
      />

      <VSelectedUserGrid
        :model="viewModel.selectedUsersViewModel.selectedUsers.value"
        v-model:isShared="viewModel.isShared.value"
      />

      <div class="flex flex-row align-items-center mt-3">
        <Button
          label="Cancel"
          class="p-button-outlined p-button-secondary ml-auto mr-2"
          @click="toggle"
        />
        <div
          :class="{'p-disabled': !viewModel.canSave.value}"
        >
          <Button

            label="Save"
            @click="onSave"
          />
        </div>
      </div>
    </div>
  </VDialogWrapper>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';

import WorkbookStore from '@/ts/stores/WorkbookStore';
import VDialogWrapper from '@/components/VDialogWrapper.vue';
import ViewModel from '@/ts/viewModels/Permission/ViewsPermissionViewModel';
import VSelectedUserGrid from '@/components/VSelectedUserGrid.vue';

const store = inject('WorkbookStore') as WorkbookStore;
const viewModel = new ViewModel(store);

const wrapper = ref();

const toggle = () => {
  wrapper.value.toggle();

  if (wrapper.value.visible) {
    viewModel.initialize(store.currentViewId.value);
  }
};

const onSave = async () => {
  await viewModel.updateView();
  toggle();
};

defineExpose({
  toggle,
});
</script>

<style lang="scss" scoped>
.dropdown {
  min-width: 15rem;
}

.members-container {
  min-height: 400px;
  max-height: 600px;
  overflow: auto;
}
</style>
