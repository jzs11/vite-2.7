<template>
  <VCardSkeleton v-if="loading" />
  <Card v-else>
    <template #content>
      <form
        :id="id"
        class="p-fluid v-form"
        @submit.prevent="$emit('save')"
      >
        <slot />
      </form>
    </template>
    <template #footer>
      <div class="flex">
        <VButton
          label="Save"
          @click="$emit('save')"
        />
        <VButton
          v-if="showDelete"
          class="ml-auto p-button-danger p-button-outlined"
          label="Delete"
          @click="$emit('delete')"
        />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import VCardSkeleton from './VCardSkeleton.vue';

defineEmits(['save', 'delete']);

defineProps({
  id: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
});
</script>
