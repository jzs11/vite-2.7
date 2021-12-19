<template>
  <div class="p-float-label p-input-icon-right">
    <slot />
    <InputText
      :id="id"
      v-model="model"
      :class="{ 'p-invalid': invalid, 'p-disabled': disabled }"
    />
    <label
      :for="id"
      :class="{ 'p-error': invalid }"
    >{{ label }}</label>
  </div>

  <span v-if="invalid">
    <small class="p-error">{{ errorMessage }}</small>
  </span>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import InputText from 'primevue/inputtext';
import { computed, PropType } from 'vue';
import { IRule } from '@/ts/Interfaces';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  isDirty: {
    type: Boolean,
    default: false,
  },
  rule: {
    type: Object as PropType<IRule>,
    required: false,
    default: null,
  },
  data: {
    type: String,
    required: true,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:data']);
const model = useVModel(props, 'data', emit);
const invalid = computed(() => {
  if (!props.rule) return false;
  return props.isDirty && props.rule.$invalid;
});
const errorMessage = computed(() => props.rule?.$silentErrors[0]?.$message || '');
</script>
