<template>
  <div
    class="flex align-items-center"
    :class="{ 'p-disabled': disabled }"
  >
    <div
      class="checkbox-wrapper flex"
      :style="style"
    >
      <div
        role="button"
        aria-disabled="true"
        tabindex="-1"
        class="inner"
        @click="toggle"
        @keydown="toggle"
      >
        <svg
          v-if="model"
          viewBox="0 0 14 14"
          class="check"
        >
          <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039" />
        </svg>

        <svg
          v-else
          viewBox="0 0 16 16"
          class="checkboxSquare"
        >
          <path d="M1.5,1.5 L1.5,14.5 L14.5,14.5 L14.5,1.5 L1.5,1.5 Z M0,0 L16,0 L16,16 L0,16 L0,0 Z" />
        </svg>
      </div>
    </div>
    <div
      class="mt-1 ml-1"
      v-if="!!label"
      v-text="label"
    />
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:data']);
const model = useVModel(props, 'data', emit);
const style = computed(() => (model.value ? 'background: rgb(46, 170, 220)' : ''));
const toggle = () => {
  model.value = !model.value;
};
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  flex-shrink: 0;
  flex-grow: 0;
  transition: background 200ms ease-out 0s;
  margin-top: 5px;

  .check {
    width: 12px;
    height: 12px;
    display: block;
    flex-shrink: 0;
    backface-visibility: hidden;
    fill: white;
  }

  .checkboxSquare {
    width: 100%;
    height: 100%;
    display: block;
    flex-shrink: 0;
    backface-visibility: hidden;
  }

  .inner {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
</style>
