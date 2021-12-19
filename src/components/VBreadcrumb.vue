<template>
  <div class="flex flex-row align-items-baseline">
    <VDivButton
      v-if="hideLeftPanel"
      :style="'height: 30px'"
      class="ml-2 menuButton"
      :small-padding="true"
      :radius="true"
      @click="showLeftPanel"
    >
      <div>
        <i
          class="pi pi-bars"
          style="font-size: 1.3rem; font-weight: 300; position: absolute; padding-top: 3px"
        />
        <i
          class="pi pi-angle-double-right"
          style="font-size: 1.3rem; font-weight: 300; padding-top: 3px"
        />
      </div>
    </VDivButton>

    <Breadcrumb
      :home="home"
      :model="items"
      class="v-breadcrumb flex flex-row align-items-baseline"
    >
      <template #item="{item}">
        <VDivButton
          :label="item.label as string"
          :radius="true"
          :small-padding="true"
          @click="goto(item.to)"
          :style="'height: 29px'"
        >
          <i
            v-if="item.to === '/'"
            class="pi pi-home"
          />
        </VDivButton>
      </template>
    </Breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted, onUnmounted, reactive, toRefs, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { getBreadcrumb } from '@/ts/utils/BreadcrumbHub';
import { IBreadcrumb } from '@/ts/Interfaces';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import router from '@/ts/router';

// Breadcrumb related
const breadcrumbState = reactive(getBreadcrumb());

const onUpdateBreadcrumb = (value: unknown) => {
  const breadcrumbValue = value as IBreadcrumb;
  breadcrumbState.home = breadcrumbValue.home;
  breadcrumbState.items = breadcrumbValue.items;
};

const { home, items } = toRefs(breadcrumbState);
const route = useRoute();

watch(
  () => route.path,
  (value) => {
    const isRoot = value.toLowerCase() === '/';
    if (isRoot) {
      const initialState = getBreadcrumb();
      breadcrumbState.home = initialState.home;
      breadcrumbState.items = initialState.items;
    }
  },
);

const goto = (url: string | undefined) => {
  if (url) { router.push(url); }
};

// Panel related
const showLeftPanel = () => {
  EventBus.emit(Topics.HideLeftPanel, false);
};
const hideLeftPanel = useStorage(Topics.HideLeftPanel, false);

const onHideLeftPanel = (payload: unknown): void => {
  hideLeftPanel.value = payload as boolean;
};

onMounted(() => {
  EventBus.on(Topics.UpdateBreadcrumb, onUpdateBreadcrumb);
  EventBus.on(Topics.HideLeftPanel, onHideLeftPanel);
});

onUnmounted(() => {
  EventBus.off(Topics.UpdateBreadcrumb, onUpdateBreadcrumb);
  EventBus.off(Topics.HideLeftPanel, onHideLeftPanel);
});

</script>

<style lang="scss" scoped>
.menuButton + .v-breadcrumb {
  padding-left: 3px;
}

.menuButton {
  i.pi-bars {
    opacity: 1;
    transition: opacity 0.2s;
    -webkit-transition: opacity 0.2s;
  }

  i.pi-angle-double-right {
    opacity: 0;
    transition: opacity 0.2s;
    -webkit-transition: opacity 0.2s;
  }

  &:hover {
    i.pi-bars {
      opacity: 0;
      transition: opacity 0.2s;
      -webkit-transition: opacity 0.2s;
    }

    i.pi-angle-double-right {
      opacity: 1;
      transition: opacity 0.2s;
      -webkit-transition: opacity 0.2s;
    }
  }
}
</style>
