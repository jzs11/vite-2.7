<template>
  <div
    ref="div"
    :contenteditable="isEditable"
    class="single-line"
    :class="{ 'p-disabled': disabled }"
    @input="onInputChange"
    :placeholder="placeholder"
  >
    {{ model }}
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { useDebounceFn, useVModel } from '@vueuse/core';

const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  isEditable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Untitled',
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['valueChanged', 'update:data']);

const onInputChange = useDebounceFn((e: Event) => {
  const target = e.target as HTMLDivElement;
  emit('valueChanged', target.innerText);
  emit('update:data', target.innerText);
}, 300);

const model = useVModel(props, 'data', emit);
const div = ref<HTMLDivElement>();

const setEndOfContenteditable = (contentEditableElement:HTMLDivElement) => {
  let range;
  let selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

nextTick(() => {
  if (props.autoFocus) {
    if (div.value) { setEndOfContenteditable(div.value); }
  }
});

</script>
