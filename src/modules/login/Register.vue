<template>
  <div class="login-panel">
    <Version />

    <form
      v-if="!accountCreated"
      class="login-form p-fluid app-login-form"
      @submit.prevent="register(!v$.$invalid)"
    >
      <h2>Create Account</h2>
      <p>
        Already have an account?
        <router-link :to="Paths.SignIn">
          Sign In
        </router-link>
      </p>

      <!-- Company -->
      <div class="field col-12">
        <VInputText
          id="company"
          label="Company Key*"
          :rule="v$.company"
          :is-dirty="submitted"
          v-model:data="state.company"
        >
          <i class="pi pi-key" />
        </VInputText>
      </div>

      <!-- Email -->
      <div class="field col-12">
        <VInputText
          id="email"
          label="Email*"
          :rule="v$.email"
          :is-dirty="submitted"
          v-model:data="state.email"
        >
          <i class="pi pi-envelope" />
        </VInputText>
      </div>

      <!-- Password -->
      <div class="field col-12">
        <VPassword
          id="password"
          label="Password*"
          :feedback="true"
          :rule="v$.password"
          :is-dirty="submitted"
          v-model:data="state.password"
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

      <!-- Repeat Password -->
      <!-- It would be nice to use the VPassword, however sameAs does not work as expected -->
      <div class="field col-12">
        <div class="p-float-label">
          <Password
            id="repeatPassword"
            :feedback="false"
            v-model="state.repeatPassword"
            :class="passwordInvalidClass"
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

      <div class="col-12">
        <VButton label="CREATE" />
      </div>
    </form>

    <Card v-else>
      <template #header>
        <span
          role="img"
          aria-label="book"
        >📚</span>
      </template>
      <template #content>
        <span
          role="img"
          aria-label="nothing"
        >🎉</span> Congratulations We have prepared your account, welcome aboard.
      </template>
      <template #footer>
        <router-link :to="Paths.SignIn">
          Click here to login.
        </router-link>
      </template>
    </Card>

    <SocialMedia />
  </div>

  <Banner message="Create Account" />
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { email, minLength, required } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
import Version from './VersionBanner.vue';
import { CreateUserCommand } from '@/ts/middleware/web-api';
import Paths from '@/ts/router/map';
import IdentityStore from '@/ts/stores/IdentityStore';
import Banner from './Banner.vue';
import SocialMedia from './SocialMedia.vue';

const state = reactive({
  company: '',
  email: '',
  password: '',
  repeatPassword: '',
});

const rules = {
  company: { required },
  email: { required, email },
  password: { required, minLength: minLength(6) },
  repeatPassword: { required },
};

const submitted = ref(false);
const v$ = useVuelidate(rules, state);
const passwordsAreNotSame = computed(() => state.password !== state.repeatPassword);

const accountCreated = ref(false);

const store = new IdentityStore();
const register = (isFormValid: boolean) => {
  submitted.value = true;
  if (!isFormValid || passwordsAreNotSame.value) return;
  store.registerUser(state as CreateUserCommand).then(() => {
    accountCreated.value = true;
  });
};
const passwordInvalidClass = computed(() => (passwordsAreNotSame.value ? 'p-invalid' : ''));
</script>
