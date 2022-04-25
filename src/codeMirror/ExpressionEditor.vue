<template>
  <div
    id="editor"
    class="editor"
  />
</template>

<script lang="ts" setup>
import {
  onMounted,
} from 'vue';

import ExpressionInputViewModel from './ExpressionInputViewModel';

const viewModel = new ExpressionInputViewModel();

onMounted(() => {
  viewModel.init();
});

</script>
