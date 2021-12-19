<template>
  <div v-if="relatedRows.length > 0">
    <div
      v-for="row in relatedRows"
      :key="row.itemId"
      class="flex align-items-center mr-3"
      style="min-height: 21px"
    >
      <div
        v-if="!row.hideNameField"
        class="flex align-items-center"
        style="cursor: pointer"
        @click="openItem(row)"
        @keydown="()=>{}"
      >
        <i class="pi pi-file mr-1" />
        <div class="key-field key-name mr-2">
          {{ row.title }}
        </div>
      </div>

      <v-chip
        v-if="row.status"
        :color="row.status.color"
        :label="row.status.name?.toString()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IRelatedRowData } from '@/ts/Interfaces';
import VChip from '@/components/VChip.vue';

const emits = defineEmits(['openItemEvent']);

const props = defineProps({
  keys: {
    type: String,
    default: '',
  },
});

const relatedRows = computed(() => {
  if (!props.keys) return [];

  return JSON.parse(props.keys) as IRelatedRowData[];
});

const openItem = (row: IRelatedRowData) => emits('openItemEvent', row);
</script>
