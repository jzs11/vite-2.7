<template>
  <VForm
    @save="save()"
    :loading="isLoading"
  >
    <div class="field col-12">
      <VInputText
        id="email"
        v-model:data="email"
        label="Email"
        :disabled="true"
      />
    </div>
    <div class="field col-12">
      <VInputText
        id="firstname"
        v-model:data="firstName"
        label="Firstname"
      />
    </div>
    <div class="field col-12">
      <VInputText
        id="lastName"
        v-model:data="lastName"
        label="Lastname"
      />
    </div>

    <div class="field col-12">
      <VInputText
        id="address"
        v-model:data="address"
        label="Address"
      />
    </div>
  </VForm>
</template>

<script lang="ts" setup>
import {
  onBeforeMount, reactive, ref, toRaw, toRefs,
} from 'vue';
import IdentityStore from '@/ts/stores/IdentityStore';
import { UpdateUserCommand } from '@/ts/middleware/web-api';
import VForm from '@/components/VForm.vue';
import VInputText from '@/components/VInputText.vue';

const identityStore = new IdentityStore();
const state = reactive({
  firstName: '',
  lastName: '',
  address: '',
} as UpdateUserCommand);
const isLoading = ref(true);

const save = () => {
  identityStore.updateProfile(toRaw(state));
};

const { firstName, lastName, address } = toRefs(state);
const email = identityStore.getEmail();

onBeforeMount(async () => {
  const result = await identityStore.getUserProfile();
  state.firstName = result.firstName || '';
  state.lastName = result.lastName || '';
  state.address = result.address || '';
  isLoading.value = false;
});
</script>
