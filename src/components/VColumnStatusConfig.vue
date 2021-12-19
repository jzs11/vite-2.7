<template>
  <div class="pb-3">
    <InputText
      type="text"
      class="borderless-input radius-0"
      :placeholder="`Type to create for ${currentColumn.caption}`"
      v-model="name"
      @keyup.enter="onAdd"
      style="min-width: 390px"
    />
  </div>

  <draggable
    class="pb-3"
    v-model="list"
    v-bind="options"
    @start="drag = true"
    @end="onDragEnd"
    item-key="id"
    handle=".handle"
  >
    <template #item="{ element }">
      <div class="focusable-field v-drag-row flex flex-row pl-2 pr-1 align-items-center">
        <VDragIcon class="handle draggable-icon" />
        <div
          class="v-hover flex flex-row align-items-center"
          style="height: 30px; width: 100%; padding-left: 1rem"
        >
          <v-chip
            :color="element.color"
            :label="element.name"
          />

          <div
            ref="selectorWrapper"
            class="ml-auto mr-1"
          >
            <VStatusSelector
              :data="element"
              @change-name-event="onChangeNameEvent(element, $event)"
              @change-color-event="onChangeColorEvent(element, $event)"
              @delete-event="onDeleteEvent"
            />
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts" setup>
import {
  computed, inject, PropType, ref, watch,
} from 'vue';
import draggable from 'vuedraggable';
import { PropertyDefinition, Status } from '@/ts/middleware/web-api';
import { statusColors } from '@/ts/AppStatic';
import VChip from '@/components/VChip.vue';
import VStatusSelector from './VColumnStatusSelector.vue';
import WorkbookStore from '@/ts/stores/WorkbookStore';

const props = defineProps({
  currentColumn: {
    type: Object as PropType<PropertyDefinition>,
    required: true,
  },
});

const store = inject('WorkbookStore') as WorkbookStore;

const name = ref();
const drag = ref(false);

const list = ref(
  props.currentColumn.status?.map((p, index) => ({
    id: index,
    name: p.name,
    color: p.color,
  })),
);

const innerColumn = ref<PropertyDefinition>(props.currentColumn);
const selectorWrapper = ref();

const options = computed(() => ({
  animation: 250,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}));

watch(
  () => props.currentColumn,
  (newValue) => {
    innerColumn.value = newValue;
  },
  { immediate: true },
);

const update = async () => {
  const temp = list.value?.map((p) => Status.fromJS({ name: p.name, color: p.color }));
  innerColumn.value.status = temp;
  await store.updateProperty(innerColumn.value);
};

const onAdd = (): void => {
  if (!name.value) return;

  const found = innerColumn.value.status?.find((p) => p.name?.toLowerCase() === name.value.toLowerCase());
  if (found) {
    return;
  }

  const random = Math.floor(Math.random() * 10);
  const temp = { id: list.value?.length || 0, name: name.value, color: `#${statusColors[random].value}` };

  list.value?.push(temp);

  name.value = '';
  update();
};

const onDragEnd = () => {
  drag.value = false;
  update();
};

const onChangeNameEvent = async (status: Status, newValue: string) => {
  const oldValue = status.name;
  status.name = newValue;
  await update();
  if (oldValue) { await store.replaceColumnValue(innerColumn.value, oldValue, newValue); }
};

const onChangeColorEvent = (status: Status, newValue: string) => {
  status.color = newValue;
  update();
};

const onDeleteEvent = (key: string) => {
  list.value = list?.value?.filter((p) => p.name !== key);
  update();
};
</script>
