<template>
  <div
    contenteditable="false"
    class="pseudoSelection"
    data-content-editable-void="true"
    style="
      user-select: none;
      --pseudoSelection--background: transparent;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      flex-grow: 0;
      position: sticky;
      left: 0px;
      z-index: 2;
    "
  >
    <div
      style="
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 220px;
        cursor: default;
      "
    >
      <div style="width: 100%; cursor: inherit">
        <div style="width: 100%; height: 100%">
          <img
            :src="url"
            style="
              display: block;
              object-fit: cover;
              border-radius: 0px;
              width: 100%;
              height: 220px;
              opacity: 1;
              object-position: center 45.37%;
            "
          >
        </div>
      </div>
      <div
        style="
          background: rgba(0, 0, 0, 0.4);
          border-radius: 3px;
          color: white;
          font-size: 12px;
          font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji',
            Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
          width: 180px;
          left: calc(50% - 90px);
          padding: 0.3em 1.5em;
          pointer-events: none;
          position: absolute;
          top: calc(50% - 10px);
          text-align: center;
          opacity: 0;
        "
      >
        Drag image to reposition
      </div>
      <div style="position: relative; pointer-events: none; max-width: 100%; width: 900px; opacity: 0">
        <div
          style="
            color: rgba(55, 53, 47, 0.6);
            fill: rgba(55, 53, 47, 0.6);
            font-size: 12px;
            background: white;
            box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
            display: flex;
            white-space: nowrap;
            border-radius: 3px;
            max-width: calc(100% - 16px);
            min-height: 24px;
            overflow: hidden;
            pointer-events: none;
            opacity: 0;
            font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji',
              Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
            position: absolute;
            right: 8px;
            bottom: 8px;
            z-index: 2;
            margin-right: calc(96px + env(safe-area-inset-right));
            margin-left: calc(96px + env(safe-area-inset-left));
          "
        >
          <div
            class="notion-focusable"
            role="button"
            tabindex="0"
            style="
              user-select: none;
              transition: background 20ms ease-in 0s;
              cursor: pointer;
              display: flex;
              align-items: center;
              padding: 4px 6px;
              border-right: 1px solid rgba(55, 53, 47, 0.09);
              font-weight: 500;
              color: rgba(55, 53, 47, 0.6);
              fill: rgba(55, 53, 47, 0.6);
            "
          >
            Change cover
          </div>
          <div
            class="notion-focusable"
            role="button"
            tabindex="0"
            style="
              user-select: none;
              transition: background 20ms ease-in 0s;
              cursor: pointer;
              display: flex;
              align-items: center;
              padding: 4px 6px;
              border-right: none;
              font-weight: 500;
              color: rgba(55, 53, 47, 0.6);
              fill: rgba(55, 53, 47, 0.6);
            "
          >
            Reposition
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

defineProps({
  imageUrl: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1489664729864-ee8499a4ddd5?ixlib=rb-1.2.1&amp;q=85&amp;fm=jpg&amp;crop=entropy&amp;cs=srgb&amp;w=7200',
  },
});

const url = ref('');

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

onMounted(() => {
  const temp = [
    // eslint-disable-next-line max-len
    'https://images.unsplash.com/photo-1489664729864-ee8499a4ddd5?ixlib=rb-1.2.1&amp;q=85&amp;fm=jpg&amp;crop=entropy&amp;cs=srgb&amp;w=7200',
    // eslint-disable-next-line max-len
    'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1908&q=80',
    // eslint-disable-next-line max-len
    'https://images.unsplash.com/photo-1542621323-be453184db76?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80',
  ];

  url.value = temp[getRandomInt(temp.length)];
});
</script>
