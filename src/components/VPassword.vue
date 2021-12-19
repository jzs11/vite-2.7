<template>
  <div>
    <div class="p-float-label">
      <Password
        :id="id"
        :feedback="feedback"
        v-model="model"
        :class="passwordClass"
        toggle-mask
        medium-regex="^[a-zA-Z0-9]{6,}$"
      >
        <template #header>
          <slot name="header" />
        </template>

        <template #footer>
          <slot name="footer" />
        </template>
      </Password>
      <label
        :for="id"
        :class="{ 'p-error': invalid }"
      >{{ label }}</label>
    </div>
    <small
      v-if="invalid"
      class="p-error"
    >{{ errorMessage }}</small>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import Password from 'primevue/password';
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
  isDirty: Boolean,
  rule: {
    type: Object as PropType<IRule>,
    required: true,
  },
  feedback: {
    type: Boolean,
    default: false,
  },
  data: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:data']);

const model = useVModel(props, 'data', emit);
const invalid = computed(() => props.isDirty && props.rule.$invalid);
const errorMessage = computed(() => props.rule.$silentErrors[0]?.$message);
const passwordClass = computed(() => (invalid.value ? 'p-invalid' : ''));
</script>
