<template>
  <VForm
    @save="save(!v$.$invalid)"
    :loading="false"
  >
    <div class="field col-12 md-12">
      <VPassword
        id="current_password"
        label="Current Password*"
        :rule="v$.oldPassword"
        :is-dirty="submitted"
        v-model:data="state.oldPassword"
      />
    </div>

    <div class="field col-12 md-12">
      <VPassword
        id="new_password"
        label="New Password*"
        :feedback="true"
        :rule="v$.newPassword"
        :is-dirty="submitted"
        v-model:data="state.newPassword"
      >
        <template #header>
          <h6>Pick a password</h6>
        </template>
        <template #footer>
          <Divider />
          <ul
            class="pl-2 ml-2 mt-0"
            style="line-height: 1.5"
          >
            <li>Include a lowercase</li>
            <li>Include a uppercase</li>
            <li>Include a numeric</li>
            <li>At least 6 letters</li>
          </ul>
        </template>
      </VPassword>
    </div>

    <div class="field col-12 md-12">
      <div class="p-float-label">
        <Password
          id="repeatPassword"
          :feedback="false"
          v-model="state.repeatPassword"
          :class="passwordClass"
          toggle-mask
        />
        <label
          for="repeatPassword"
          :class="{ 'p-error': passwordsAreNotSame }"
        >Repeat Password*</label>
      </div>
      <small
        v-if="passwordsAreNotSame"
        class="p-error"
      >Passwords must be identical.</small>
    </div>
  </VForm>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
import VForm from '@/components/VForm.vue';
import { ToastSeverity } from '@/ts/Enums';
import IdentityStore from '@/ts/stores/IdentityStore';

const initialState = () => ({
  oldPassword: '',
  newPassword: '',
  repeatPassword: '',
});

const state = reactive(initialState());

const rules = {
  oldPassword: { required },
  newPassword: { required, minLength: minLength(6) },
  repeatPassword: { required },
};

const submitted = ref(false);
const v$ = useVuelidate(rules, state);
const passwordsAreNotSame = computed(() => state.newPassword !== state.repeatPassword);

const passwordClass = computed(() => (passwordsAreNotSame.value ? 'p-invalid' : ''));

const save = async (isFormValid: boolean) => {
  submitted.value = true;
  if (!isFormValid || passwordsAreNotSame.value) return;
  const store = new IdentityStore();
  store.resetPassword(state.oldPassword, state.newPassword).then((p) => {
    if (p.toast?.severity === ToastSeverity.Success) {
      Object.assign(state, initialState());
    }
    submitted.value = false;
  });
};
</script>
