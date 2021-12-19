<template>
  <VCheckbox
    :class="{ 'p-disabled': disabled }"
    v-model:data="selected"
  />
</template>

<script lang="ts" setup>
import {
  inject, PropType, ref, watch,
} from 'vue';
import VCheckbox from '@/components/VCheckbox.vue';
import { ICellData, IRowValue } from '@/ts/Interfaces';
import TableViewModel from '@/ts/viewModels/TableViewModel';

const props = defineProps({
  data: {
    type: Object as PropType<ICellData<boolean>>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const tableViewModel = inject('TableViewModel') as TableViewModel;
const selected = ref(props.data?.value || false);

const onChange = (value: boolean) => {
  const cell = props.data.row.cells.find((p) => p.columnIndex === props.data.columnIndex);
  // const stamp = props.data.data.s_stamp;
  const payload = {} as IRowValue;
  const field = cell?.column?.dataField || '';

  payload[field] = value;
  payload.s_id = props.data.key;
  payload.s_stamp = props.data.data.s_stamp;

  tableViewModel.updateRow(payload);
};
watch(
  () => selected.value,
  (a) => {
    onChange(a);
  },
);
</script>
