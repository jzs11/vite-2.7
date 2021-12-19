<template>
  <div
    id="loginImage"
    class="login-image"
  >
    <transition name="slide-fade">
      <div
        v-if="show"
        class="login-image-content p"
      >
        <h1>Systemis</h1>
        <h1 id="loginHeaderH1">
          {{ message }}
        </h1>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';

defineProps({
  message: {
    type: String,
    required: true,
  },
});

const show = ref(false);

onBeforeMount(() => {
  show.value = false;
});

onMounted(() => {
  show.value = true;
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 1.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 1.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>
