<template>
  <div class="login-panel">
    <Version />

    <form
      class="login-form p-fluid app-login-form"
      @submit.prevent="login(!v$.$invalid)"
    >
      <h2>Login to your account</h2>
      <p>
        New Customer?
        <router-link :to="Paths.UserNew">
          Sign up
        </router-link>
      </p>

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

      <div class="field col-12">
        <VPassword
          id="password"
          label="Password*"
          :rule="v$.password"
          :is-dirty="submitted"
          v-model:data="state.password"
        />
      </div>

      <div class="col-12">
        <VButton label="SIGN IN" />
      </div>
    </form>

    <SocialMedia />
  </div>

  <Banner message="Customer Login" />
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Version from './VersionBanner.vue';
import { LoginUserQuery } from '@/ts/middleware/web-api';
import router from '@/ts/router';
import Paths from '@/ts/router/map';
import IdentityStore from '@/ts/stores/IdentityStore';
import Banner from './Banner.vue';
import SocialMedia from './SocialMedia.vue';

const state = reactive({
  email: 'ss_admin@localhost.com',
  password: 'password',
});

const rules = {
  email: { required, email },
  password: { required },
};
const submitted = ref(false);
const v$ = useVuelidate(rules, state);
const store = new IdentityStore();
const route = useRoute();

// methods
const login = (isFormValid: boolean) => {
  submitted.value = true;
  if (!isFormValid) return;
  store.login(state as LoginUserQuery).then(() => {
    router.push(route.query.redirect?.toString() || '/');
  });
};
</script>
