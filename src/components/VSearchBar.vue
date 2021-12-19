<template>
  <VDivButton
    v-if="!showInput"
    label="Search"
    :radius="true"
    @click="startSearch"
  >
    <template #before>
      <i
        class="pi pi-search pr-2"
        style="font-size: 12px"
      />
    </template>
  </VDivButton>
  <div
    v-else
    class="pl-1 search-wrapper"
    style="margin-top: 5px"
    ref="searchWrapper"
  >
    <div class="input-container">
      <i
        class="pi pi-search pr-2"
        style="font-size: 12px; font-weight: bold"
      />
      <input
        ref="searchInput"
        placeholder="Type to search..."
        type="text"
        class="input"
        v-model="searchValue"
        @blur="onBlur"
      >
      <div
        v-if="!!searchValue"
        class="focusable-field clear-btn"
        role="button"
        tabindex="-1"
        @click="clearSearch"
      >
        <VCrossSvg />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { debouncedWatch } from '@vueuse/core';
import VCrossSvg from '@/components/svgs/VCross.vue';

const props = defineProps({
  searchText: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['searchChanged']);
const showInput = ref(false);
const searchValue = ref(props.searchText);
const searchInput = ref<HTMLInputElement>();
const searchWrapper = ref<HTMLDivElement>();

debouncedWatch(
  () => searchValue.value,
  (newValue) => {
    emit('searchChanged', newValue);
  },
  { debounce: 500 },
);

const startSearch = () => {
  showInput.value = true;
};

const clearSearch = () => {
  showInput.value = false;
  searchValue.value = '';
  searchWrapper.value?.classList.remove('wider');
};

const onBlur = () => {
  if (!searchValue.value) {
    clearSearch();
  }
};

watch(
  () => showInput.value,
  (newValue) => {
    if (!newValue) return;
    nextTick(() => {
      searchInput.value?.focus();
      searchWrapper.value?.classList.add('wider');
    });
  },
);
</script>

<style lang="scss" scoped>
.search-wrapper {
  width: 100px;
}
.search-wrapper.wider {
  width: 190px;
  -webkit-transition: width 0.2s ease-in-out;
  -moz-transition: width 0.2s ease-in-out;
  -o-transition: width 0.2s ease-in-out;
  transition: width 0.2s ease-in-out;
}
.input-container {
  display: flex;
  align-items: center;
  border: none;
  padding: 0px 4px 0px 0px;
  width: 100%;
  background: transparent;
  font-size: 14px;
  line-height: 1;
  color: rgb(55, 53, 47);
  font-weight: 500;
  margin-bottom: 1px;
}
.input {
  font-size: inherit;
  line-height: inherit;
  border: none;
  background: none;
  display: block;
  resize: none;
  padding: 0px;
  width: 100%;
  font-weight: 600;
}
.clear-btn {
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  flex-shrink: 0;
  flex-grow: 0;
  border-radius: 20px;
}
</style>
