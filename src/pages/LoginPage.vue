<script setup lang="ts">
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppLink from "../components/ui/AppLink.vue";
import { useLoginStore } from "../stores/login.ts";

const auth = useLoginStore();
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Sign in to your account
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Welcome back! Please enter your details.
      </p>
    </div>

    <form class="space-y-5" novalidate @submit.prevent="auth.login">
      <AppInput
        v-model="auth.email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :error="auth.fieldErrors.email"
        required
      />

      <AppInput
        v-model="auth.password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
        :error="auth.fieldErrors.password"
        required
      />

      <p v-if="auth.serverError" class="text-sm text-red-600 dark:text-red-400">
        {{ auth.serverError }}
      </p>

      <div class="flex items-center justify-end">
        <AppLink to="#">Forgot password?</AppLink>
      </div>

      <AppButton
        type="submit"
        label="Sign in"
        :loading="auth.loading"
        :block="true"
        size="lg"
      />
    </form>

    <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
      Don't have an account?
      <AppLink :to="{ name: 'register' }">Create one</AppLink>
    </p>
  </div>
</template>
