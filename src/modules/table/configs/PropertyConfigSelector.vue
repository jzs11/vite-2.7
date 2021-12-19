<template>
  <VDropdown
    :label="helper.convertToDisplay(data)"
    :can-close="false"
    position="right"
  >
    <template #before-label>
      <VPropertyIcon
        classes="pr-3"
        :column="data"
      />
    </template>
    <template #after-label>
      <div class="triangle-point-right ml-auto">
        <VTriangle class="" />
      </div>
    </template>

    <div style="width: 200px; ">
      <div class="font-light-uppercase">
        Basic
      </div>
      <VDivButton
        label="Text"
        @click="selectType(0)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-text="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="Amount"
        @click="selectType(1)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-amount="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="Date"
        @click="selectType(3)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-date="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="Datetime"
        @click="selectType(5)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-date-time="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="Checkbox"
        @click="selectType(4)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-checkbox="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="Status"
        @click="selectType(6)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-status="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="TextArea"
        @click="selectType(7)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-text-area="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="Number"
        @click="selectType(2)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-number="true"
          />
        </template>
      </VDivButton>

      <VDivButton
        label="Person"
        @click="selectType(9)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-person="true"
          />
        </template>
      </VDivButton>

      <div class="border-top mt-3" />

      <div class="font-light-uppercase pt-2">
        Advanced
      </div>

      <VDivButton
        label="Relation"
        @click="selectType(8)"
      >
        <template #before>
          <VPropertyIcon
            classes="pr-3"
            :is-relation="true"
          />
        </template>
      </VDivButton>
    </div>
  </VDropdown>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { PropertyDefinition } from '@/ts/middleware/web-api';
import ColumnTypeHelper from '@/ts/helpers/ColumnTypeHelper';
import VPropertyIcon from '@/components/svgs/VPropertyIcon.vue';
import VTriangle from '@/components/svgs/VTriangle.vue';
import VDivButton from '@/components/VDivButton.vue';

const emit = defineEmits(['columnTypeChangeEvent']);
defineProps({
  data: {
    type: Object as PropType<PropertyDefinition>,
    required: true,
  },
});

const helper = new ColumnTypeHelper();

const selectType = (index: number) => {
  emit('columnTypeChangeEvent', { columnType: index, dataType: helper.convertColumnDataTypeToGridDataType(index) });
};
</script>
