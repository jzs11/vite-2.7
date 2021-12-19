/* eslint-disable camelcase */
import { useMagicKeys } from '@vueuse/core';
import { watch } from 'vue';
import EventBus from '@/ts/utils/EventBus';
import { HotKeysTopics } from '@/ts/Enums';

const { Ctrl_Enter, Delete, Alt_Enter /* ... */ } = useMagicKeys();

const registerHotkeys = () => {
  watch(Ctrl_Enter, (v) => {
    if (v) EventBus.emit(HotKeysTopics.Save);
  });

  watch(Delete, (v) => {
    if (v) EventBus.emit(HotKeysTopics.Delete);
  });

  watch(Alt_Enter, (v) => {
    if (v) EventBus.emit(HotKeysTopics.OpenAsPage);
  });
};

export default registerHotkeys;
