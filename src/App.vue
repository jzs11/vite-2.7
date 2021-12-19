<template>
  <router-view />
  <Toast position="bottom-right" />
  <ConfirmDialog />
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import startWatch from '@/ts/utils/EventsHub';
import { IConfirmationService } from '@/ts/Interfaces';

const confirm = useConfirm() as IConfirmationService;
const toast = useToast();

provide('useConfirm', confirm);
provide('useToast', toast);
startWatch(toast);
</script>

<style lang="scss">
@import '../public/App.scss';
</style>
