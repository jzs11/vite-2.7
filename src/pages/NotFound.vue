<template>
  <div class="exception-body">
    <div class="exception-content">
      <Icon
        :size="200"
        class="bounce-top "
      >
        <Grav />
      </Icon>
      <div class="exception-title mt-2">
        NOT FOUND
      </div>
      <div class="exception-detail">
        The page you are looking for is not here.
      </div>
      <Button
        label="Go back to my content.."
        class="mt-7"
        @click="goBackToMyContent"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Grav,
} from '@vicons/fa';
import { Icon } from '@vicons/utils';
import router from '@/ts/router/index';

const goBackToMyContent = () => {
  router.go(-2);
};

</script>
