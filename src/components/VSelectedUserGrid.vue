<template>
  <div class="flex flex-row pt-4">
    <div class="pr-3">
      <RadioButton
        id="public-field"
        :value="true"
        v-model="innerIsShared"
      />
      <label
        class="pl-1"
        for="public-field"
      >All users can access</label>
    </div>
    <div class="pr-3">
      <RadioButton
        id="private-field"
        :value="false"
        v-model="innerIsShared"
      />
      <label
        class="pl-1"
        for="private-field"
      >Only selected users can access</label>
    </div>
  </div>

  <div
    class="members-container mt-3 border radius-3 p-2"
  >
    <div
      v-for="viewUser in model"
      :key="viewUser.key"
      class="flex flex-row align-items-center"
    >
      <InputSwitch
        :class="'v-switch pr-2'"
        v-model="viewUser.selected"
        :id="`user-switch-${viewUser.key}`"
        @change="onInputChange"
      />

      <label
        class="pr-1 mt-2"
        :for="`user-switch-${viewUser.key}`"
        v-text="viewUser.member.userEmail"
        style="cursor: pointer;"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, watch } from 'vue';
import { useVModel } from '@vueuse/core';
import { SelectedUser } from '@/ts/viewModels/Permission/SelectedUsersViewModel';

const props = defineProps({
  isShared: {
    type: Boolean,
    required: true,
    default: undefined,
  },
  model: {
    type: Object as PropType<SelectedUser[]>,
    required: true,
  },
});

const emit = defineEmits(['update:isShared']);
const innerIsShared = useVModel(props, 'isShared', emit);

watch(() => innerIsShared.value, (newValue: boolean | undefined) => {
  if (newValue) {
    props.model.forEach((p) => {
      p.selected = true;
    });
  }
});

const onInputChange = () => {
  const partiallySelected = props.model.find((p) => !p.selected) !== undefined;

  if (partiallySelected) { emit('update:isShared', false); }
};

</script>
