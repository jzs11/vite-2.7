<template>
  <div class="pb-2">
    How many rows do you want to show in the grid?
  </div>

  <SelectButton
    v-model="displayTypeModel"
    :options="displayTypeOptions"
    option-label="name"
  />

  <div class="pt-3 pb-2">
    Append a Status column to show in the table?
  </div>

  <Dropdown
    v-model="statusColumnModel"
    :options="statusColumnsOptions"
    style="width: 300px"
    option-label="caption"
    placeholder="Select a Status Column"
    :show-clear="true"
  />

  <div
    v-if="!!statusColumnModel"
    class="pt-3 flex flex-row align-items-end"
  >
    <InputSwitch
      v-model="hideNameField"
      class="v-switch"
    />
    <div class="flex flex-row align-items-center">
      Hide the <VPropertyIcon
        class="dark pl-2 pt-1 pr-1"
        :is-title="true"
      /> Name field
    </div>
  </div>
</template>

<script lang="ts" setup>
import SelectButton from 'primevue/selectbutton';
import {
  onMounted, PropType, ref, watch,
} from 'vue';
import VPropertyIcon from '@/components/svgs/VPropertyIcon.vue';

import { PropertyDefinition, WorkbookDefinition } from '@/ts/middleware/web-api';

const props = defineProps({
  propertyDefinition: {
    type: Object as PropType<PropertyDefinition | undefined>,
    required: true,
  },
  workbook: {
    type: Object as PropType<WorkbookDefinition>,
    required: true,
  },
});

// Display Type
const displayTypeModel = ref({ name: 'All rows', value: 0 });
const displayTypeOptions = ref([
  { name: 'All rows', value: 0 },
  { name: 'Last added row', value: 1 },
]);

// Status column
const statusColumnModel = ref();
const statusColumnsOptions = ref<PropertyDefinition[] | undefined>();
function initialDisplayType() {
  const find = displayTypeOptions.value.find((p) => p.value === props.propertyDefinition?.relatedPropertyDisplayType);
  displayTypeModel.value = find || { name: 'All rows', value: 0 };
}

function initialStatusColumnDropdown() {
  statusColumnsOptions.value = props.workbook?.columns?.filter((p) => p.columnDataType === 6);
  if (props.propertyDefinition?.relatedPropertyAppendedStatusPropertyKey) {
    const found = statusColumnsOptions.value?.find(
      (p) => p.dataField === props.propertyDefinition?.relatedPropertyAppendedStatusPropertyKey,
    );

    if (found) statusColumnModel.value = found;
  }
}

// hide the name field
const hideNameField = ref(false);

onMounted(() => {
  initialDisplayType();
  initialStatusColumnDropdown();

  hideNameField.value = props.propertyDefinition?.hideTheRelatedPropertyNameField || false;
});

watch(
  () => props.workbook,
  (): void => {
    initialStatusColumnDropdown();
  },
);

const getModel = () => ({
  displayType: displayTypeModel.value?.value,
  statusColumnKey: statusColumnModel.value?.dataField,
  hideNameField: statusColumnModel.value?.dataField ? hideNameField.value : false,
});

defineExpose({ getModel });
</script>
