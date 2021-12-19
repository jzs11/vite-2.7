<template>
  <div class="flex flex-row justify-content-between mt-5">
    <ViewsDropdown @open-view-access-event="viewAccess.toggle()" />

    <div class="flex flex-row align-items-center">
      <PropertiesDropdown v-if="isAdmin" />
      <VSearchBar
        :search-text="table.searchText.value"
        @search-changed="onSearchChanged"
      />

      <ExtraMenu />
      <Button
        label="New"
        class="ml-2"
        @click="table.onNew()"
      />
    </div>
  </div>

  <ViewsPermission
    v-if="isAdmin"
    ref="viewAccess"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, inject, ref } from 'vue';
import TableViewModel from '@/ts/viewModels/TableViewModel';
import ViewsDropdown from './ViewsDropdown.vue';
import VSearchBar from '@/components/VSearchBar.vue';
import ExtraMenu from './ExtraMenu.vue';
import ViewsPermission from './ViewsPermission.vue';
import { isCurrentWorkbookAdmin } from '@/ts/GlobalState';

const PropertiesDropdown = defineAsyncComponent(() => import('./PropertiesDropdown.vue'));

const table = inject('TableViewModel') as TableViewModel;
const viewAccess = ref();
const isAdmin = ref(isCurrentWorkbookAdmin());
const onSearchChanged = (value: string) => {
  table.searchText.value = value;
};
</script>
