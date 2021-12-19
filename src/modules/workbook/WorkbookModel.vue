<template>
  <VEditableDiv
    ref="nameField"
    v-model:data="state.name"
    class="v-editable-header pr-2 pb-5"
  />

  <VItemDetailRow>
    <template #caption>
      <VDivButton label="Icon" />
    </template>
    <template #input>
      <SelectButton
        v-model="state.icon"
        :options="iconOptions"
        class="icon-select-button"
      >
        <template #option="slotProps">
          <div class="flex flex-row justify-content-center inherit-width">
            <i
              :class="getAny(slotProps, 'option')"
              style="font-size: 1.3rem"
            />
          </div>
        </template>
      </SelectButton>
    </template>
  </VItemDetailRow>

  <VItemDetailRow>
    <template #caption>
      <VDivButton label="Theme color" />
    </template>
    <template #input>
      <SelectButton
        v-model="colorRef"
        :options="colorOptions"
        data-key="value"
        class="color-select-button"
      >
        <template #option="slotProps">
          <div class="flex flex-row justify-content-center inherit-width">
            <div
              :style="{
                backgroundColor: getAny(slotProps, 'option').color,
                width: '18px',
                height: '18px',
              }"
            />
          </div>
        </template>
      </SelectButton>
    </template>
  </VItemDetailRow>

  <VItemDetailRow>
    <template #caption>
      <VDivButton label="Hide from Workbooks" />
    </template>
    <template #input>
      <VCheckbox v-model:data="state.isHidden" />
    </template>
  </VItemDetailRow>
</template>

<script lang="ts" setup>
import {
  nextTick, PropType, reactive, ref, toRaw, watch,
} from 'vue';
import SelectButton from 'primevue/selectbutton';
import { CreateWorkbookCommand, WorkbookDefinition } from '@/ts/middleware/web-api';
import * as appStatic from '@/ts/AppStatic';
import VEditableDiv from '@/components/VEditableDiv.vue';

const nameField = ref();

nextTick(() => {
  nameField.value?.$el.focus();
});

const props = defineProps({
  workbook: {
    type: Object as PropType<WorkbookDefinition>,
    required: false,
    default() {
      // eslint-disable-next-line vue/valid-define-props
      return new WorkbookDefinition();
    },
  },
});

const state = reactive({
  name: '',
  icon: 'pi pi-microsoft',
  color: 'widget-overview-box-1',
  isHidden: false,
} as CreateWorkbookCommand);

const colorRef = ref({ color: '#64b5f6', value: 'widget-overview-box-1' });
const colorOptions = ref([
  { color: appStatic.color1, value: 'widget-overview-box-1' },
  { color: appStatic.color2, value: 'widget-overview-box-2' },
  { color: appStatic.color3, value: 'widget-overview-box-3' },
  { color: appStatic.color4, value: 'widget-overview-box-4' },
  { color: appStatic.color5, value: 'widget-overview-box-5' },
  { color: appStatic.color6, value: 'widget-overview-box-6' },
  { color: appStatic.color7, value: 'widget-overview-box-7' },
  { color: appStatic.color8, value: 'widget-overview-box-8' },
  { color: appStatic.color9, value: 'widget-overview-box-9' },
]);

watch(
  () => props.workbook,
  () => {
    if (props.workbook.id) {
      state.name = props.workbook.name;
      state.icon = props.workbook.icon;
      state.color = props.workbook.color;
      state.isHidden = props.workbook.isHidden;

      colorRef.value = colorOptions.value.find((p) => p.value === state.color) || {
        color: '#64b5f6',
        value: 'widget-overview-box-1',
      };
    }
  },
);

const iconOptions = ref([
  'pi pi-microsoft',
  'pi pi-comment',
  'pi pi-file-excel',
  'pi pi-chart-bar',
  'pi pi-align-justify',
  'pi pi-envelope',
  'pi pi-id-card',
  'pi pi-palette',
  'pi pi-share-alt',
  'pi pi-star-o',
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAny(object: any, key: string): any {
  return object[key];
}

const getModel = (): CreateWorkbookCommand => {
  const result = toRaw(state);
  result.color = colorRef.value.value;
  result.name = result.name?.trim();
  return result;
};

defineExpose({ getModel });
</script>
