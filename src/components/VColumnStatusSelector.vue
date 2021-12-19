<template>
  <VDropdown @open-event="onDropdownOpen">
    <template #before-label>
      <VEllipsisH />
    </template>

    <VDropdownLayout>
      <template #top>
        <InputText
          v-model="name"
          style="width: 220px"
          ref="nameInput"
        />
      </template>

      <template #middle>
        <VDivButton
          label="Delete"
          @click="onDelete"
        >
          <template #before>
            <i class="pi pi-trash pr-3" />
          </template>
        </VDivButton>
      </template>

      <template #bottom>
        <div class="font-light-uppercase">
          Colors
        </div>

        <VDivButton
          v-for="item in statusColors"
          :key="item.value"
          :label="item.name"
          @click="changeColor(item.value)"
        >
          <template #before>
            <div
              class="color mr-3"
              :style="getStyle(item)"
            />
          </template>

          <template #after>
            <i
              class="pi pi-check ml-auto"
              v-if="selected(item)"
            />
          </template>
        </VDivButton>
      </template>
    </VDropdownLayout>
  </VDropdown>
</template>

<script lang="ts" setup>
import { nextTick, PropType, ref } from 'vue';
import { debouncedWatch } from '@vueuse/core';
import { Status } from '@/ts/middleware/web-api';
import { statusColors } from '@/ts/AppStatic';
import VDropdown from '@/components/VDropdown.vue';
import VDivButton from './VDivButton.vue';
import VEllipsisH from '@/components/svgs/VEllipsisH.vue';

const props = defineProps({
  data: {
    type: Object as PropType<Status>,
    required: true,
  },
});

const emit = defineEmits(['changeNameEvent', 'changeColorEvent', 'deleteEvent']);

const nameInput = ref();
const getStyle = (payload: { value: string }) => `background: #${payload.value}`;
const selected = (payload: { value: string }) => props.data.color?.toLowerCase() === `#${payload.value.toLowerCase()}`;

const name = ref(props.data.name);

const changeColor = (color: string) => {
  emit('changeColorEvent', `#${color}`);
};

debouncedWatch(
  () => name.value,
  (newValue) => {
    emit('changeNameEvent', newValue);
  },
  { debounce: 1000 },
);

const onDelete = () => {
  emit('deleteEvent', props.data.name);
};

const onDropdownOpen = () => {
  nextTick(() => {
    const input = nameInput?.value?.$el as HTMLInputElement;
    input.select();
    input.focus();
  });
};
</script>

<style lang="scss" scoped>
.color {
  width: 18px;
  height: 18px;
  background: rgba(206, 205, 202, 0.5);
  box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset;
  border-radius: 3px;
}
</style>
