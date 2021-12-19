<template>
  <TabView
    lazy
    class="member-tabview"
  >
    <TabPanel header="Members">
      <Members />
    </TabPanel>
    <TabPanel
      header="Groups"
      :disabled="true"
    >
      Content II
    </TabPanel>
  </TabView>
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import WorkspaceStore from '@/ts/stores/WorkspaceStore';
import Members from './Members.vue';

const workspaceStore = new WorkspaceStore();
provide('WorkspaceStore', workspaceStore);
</script>
