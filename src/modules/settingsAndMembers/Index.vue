<template>
  <div
    class="flex flex-row"
    style="height: 100%"
  >
    <!-- left side -->
    <div class="left-side-container">
      <div class="left-side">
        <div class="email">
          {{ email }}
        </div>

        <VDivButton
          label="My account"
          :class="getActiveClass(activeIndex === 'account')"
          @click="setActiveIndex('account')"
        >
          <template #before>
            <i class="pi pi-user pr-3" />
          </template>
        </VDivButton>

        <VDivButton
          label="My password"
          :class="getActiveClass(activeIndex === 'password')"
          @click="setActiveIndex('password')"
        >
          <template #before>
            <i class="pi pi-lock pr-3" />
          </template>
        </VDivButton>

        <VDivButton
          label="Languages & Region"
          class="p-disabled"
        >
          <template #before>
            <i class="pi pi-globe pr-3" />
          </template>
        </VDivButton>

        <div class="pt-4 pl-3 pb-2 fields-header">
          Workspace
        </div>

        <VDivButton
          label="Members"
          :class="getMemberActiveClass"
          @click="setActiveIndex('members')"
        >
          <template #before>
            <i class="pi pi-users pr-3" />
          </template>
        </VDivButton>
      </div>
    </div>

    <!-- right side -->
    <div class="right-container">
      <div v-if="activeIndex === 'account'">
        <div class="header">
          Account
        </div>

        <div
          class="header-des pb-3"
          tabindex="-1"
        >
          Changes to account settings will apply to all of your workspaces.
        </div>

        <UserAccount />
      </div>
      <div v-if="activeIndex === 'password'">
        <div class="header">
          Password
        </div>
        <UserPassword />
      </div>
      <div v-if="activeIndex === 'members'">
        <Members />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import { getIdentityLocalStorage, isCurrentSiteAdmin } from '@/ts/GlobalState';
import UserAccount from './settings/Profile.vue';
import UserPassword from './settings/Password.vue';

const Members = defineAsyncComponent(() => import('./members/Index.vue'));
const activeIndex = ref('account');
const email = ref(getIdentityLocalStorage().email);
const setActiveIndex = (index: string) => {
  activeIndex.value = index;
};

const getMemberActiveClass = computed(() => {
  if (activeIndex.value === 'members') {
    return 'active';
  }

  if (!isCurrentSiteAdmin()) {
    return 'p-disabled';
  }

  return '';
});

const getActiveClass = (value: boolean) => (value ? 'active' : '');
</script>

<style lang="scss" scoped>
.email {
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 11px;
  line-height: 1;
  margin-bottom: 1px;
  color: rgba(55, 53, 47, 0.6);
  font-weight: 500;
  padding: 5px 15px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.right-container {
  flex-grow: 1;
  transform: translateZ(0px);
  padding: 36px 60px;
  z-index: 1;
  overflow: auto;
  margin-right: 0px;
  margin-bottom: 0px;
}

.header {
  color: rgb(55, 53, 47);
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  margin-bottom: 16px;
  padding-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  width: auto;
}
</style>
