<template>
  <div class="container">
    <div class="top-container">
      <div class="top flex flex-row">
        <Chips
          ref="emailsChip"
          class="email-chip"
          :placeholder="placeHolder"
          v-model="emails"
          separator=","
          :allow-duplicate="false"
          @add="onChipsChange"
        />
        <div
          class="flex flex-row"
          style="align-items: center;"
        >
          <Dropdown
            class="v-none-focus v-plain-dropdown"
            v-model="accessLevel"
            :options="accessLevels"
            option-value="value"
            option-label="name"
          />

          <Button
            label="Invite"
            @click="onInvite"
          />
        </div>
      </div>
    </div>
    <div class="middle-container">
      <div class="header-des pl-4 pt-3">
        Type of paste in emails above, separated by commas.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, inject, onMounted, ref,
} from 'vue';
import Chips from 'primevue/chips';
import delay from 'lodash/delay';
import Members from '@/ts/viewModels/Members';
import { filterEmails } from '@/ts/helpers/Utils';
import WorkspaceStore from '@/ts/stores/WorkspaceStore';
import { WorkspaceMemberDto } from '@/ts/middleware/web-api';

const emit = defineEmits(['closeDropDown']);

const emails = ref();
const placeHolder = computed(() => (!emails.value ? 'Type in emails here' : ''));
const viewModel = new Members();
const accessLevel = ref(1);
const accessLevels = ref(viewModel.accessLevels);
const emailsChip = ref();
const store = inject('WorkspaceStore') as WorkspaceStore;

onMounted(() => {
  const div = emailsChip.value.$el as HTMLDivElement;
  const input = div.getElementsByTagName('input')[0] as HTMLInputElement;

  delay(() => {
    input.focus();
  }, 200);
});

const onChipsChange = (e: { originalEvent: Event; value: [] }) => {
  emails.value = filterEmails(e.value);
};

const onInvite = async (): Promise<void> => {
  let emailArray = [];
  if (!emails.value && emailsChip.value?.inputValue) {
    emailArray = [emailsChip.value?.inputValue];
  } else {
    emailArray = emails.value as string[];
  }

  const members = emailArray.map(
    (p) =>
      WorkspaceMemberDto.fromJS({
        userEmail: p,
        accessLevel: accessLevel.value,
      }),
  );

  await store.inviteMember(members);
  emit('closeDropDown');
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 480px;
  min-width: 180px;
  max-width: calc(100vw - 24px);
  height: 30vh;
  max-height: 70vh;
}
.top-container {
  flex-shrink: 0;
  max-height: 240px;
  box-shadow: rgb(55 53 47 / 16%) 0px -1px inset;
  z-index: 1;
  overflow: hidden auto;
  margin-right: 0px;
  margin-bottom: 0px;
}
.top {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 100%;
  min-height: 34px;
  background: rgba(242, 241, 238, 0.6);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 14px;
  cursor: text;
  overflow: hidden;
  padding: 8px 14px;
}
.middle-container {
  flex-grow: 1;
  min-height: 0px;
  transform: translateZ(0px);
  z-index: 1;
  overflow: hidden auto;
  margin-right: 0px;
  margin-bottom: 0px;
}
</style>
