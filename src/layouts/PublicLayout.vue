<template>
  <div class="login-body">
    <div class="login-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PublicLayout',
});
</script>
