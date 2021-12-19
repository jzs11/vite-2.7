<template>
  <VDivButton
    :label="label"
    :class="classes"
    @click="toggle"
    :style="style"
    ref="divButton"
  >
    <template #before>
      <slot name="before-label" />
    </template>

    <template #after>
      <slot name="after-label" />
    </template>

    <slot name="label" />
  </VDivButton>

  <OverlayPanel
    ref="overlayPanel"
    :class="overlayClasses"
    :dismissable="canClose"
  >
    <slot />
  </OverlayPanel>
</template>

<script lang="ts" setup>
import {
  computed, nextTick, onMounted, onUnmounted, ref, watch,
} from 'vue';
import uniqueId from 'lodash/uniqueId';
import VDivButton from '@/components/VDivButton.vue';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    required: false,
    default: '',
  },
  canClose: {
    type: Boolean,
    default: true,
  },
  canCloseOtherDropdown: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
  overlayClass: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['openEvent', 'hideEvent']);

const uid = uniqueId();
const divButton = ref<typeof VDivButton>();
const overlayPanel = ref();
let currentZIndex = 0;

const toggle = (event: MouseEvent) => {
  if (!overlayPanel.value.visible && props.canCloseOtherDropdown) {
    EventBus.emit(Topics.CloseDropdownExceptSelf, uid);
  }

  overlayPanel.value.toggle(event);

  nextTick(() => {
    const div = overlayPanel.value.container as HTMLDivElement;
    if (div) {
      currentZIndex = parseInt(div.style.zIndex, 10);
    }
  });
};

const hide = (event: MouseEvent) => {
  if (overlayPanel.value?.visible) {
    toggle(event);
  }
};

const classes = computed(() => `v-overlay radius-3 ${props.class}`);
const overlayClasses = computed(() => `drop-down-overlay v-overlay-panel ${props.overlayClass}`);

const findHighestZIndex = () => {
  const divs = document.getElementsByTagName('div');
  let highest = 0;
  for (let i = 0; i < divs.length; i++) {
    const zindex = parseInt(divs[i].style.zIndex, 10);
    if (zindex > highest) {
      highest = zindex;
    }
  }
  return highest;
};

const repositionContainer = () => {
  if (!props.position) return;

  if (props.position === 'right') {
    const domReact = divButton.value?.$el.getBoundingClientRect() as DOMRect;

    nextTick(() => {
      const container = overlayPanel.value?.container as HTMLDivElement;
      container.style.transformOrigin = 'center top';
      container.style.top = `${domReact.top - container.getBoundingClientRect().height / 2}px`;
      container.style.left = `${domReact.left + 240}px`;
    });
  }
};

watch(
  () => overlayPanel.value?.visible,
  (newValue) => {
    if (newValue === true) {
      emit('openEvent');
      repositionContainer();
    }
    if (newValue === false) {
      emit('hideEvent');
    }
  },
);

const onCloseDropdown = () => {
  if (overlayPanel.value?.visible) {
    if (currentZIndex === findHighestZIndex()) {
      overlayPanel.value.toggle(null);
    }
  }
};

const onCloseDropdownExceptSelf = (payload: unknown): void => {
  if (payload !== uid) {
    hide(new MouseEvent(''));
  }
};

onMounted(() => {
  EventBus.on(Topics.CloseDropdown, onCloseDropdown);
  EventBus.on(Topics.CloseDropdownExceptSelf, onCloseDropdownExceptSelf);
});

onUnmounted(() => {
  EventBus.off(Topics.CloseDropdown, onCloseDropdown);
  EventBus.off(Topics.CloseDropdownExceptSelf, onCloseDropdownExceptSelf);
});

defineExpose({ toggle, hide });
</script>
