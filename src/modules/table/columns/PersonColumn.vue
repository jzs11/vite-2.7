<template>
  <div>
    <i class="pi pi-user pr-2" />
    <span
      class="key-field"
      v-text="email"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  email: {
    type: String,
    default: '',
  },
});
</script>
