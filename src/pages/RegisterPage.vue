<script setup lang="ts">
import AppInput from "../components/ui/AppInput.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppLink from "../components/ui/AppLink.vue";
import { useRegisterStore } from "../stores/register.ts";

const register = useRegisterStore();
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Create an account
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started — it only takes a minute.
      </p>
    </div>

    <form class="space-y-5" novalidate @submit.prevent="register.register">
      <AppInput
        v-model="register.displayName"
        name="display-name"
        label="Display name"
        type="text"
        placeholder="Jane Doe"
        autocomplete="name"
        :error="register.fieldErrors.displayName"
      />

      <AppInput
        v-model="register.email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :error="register.fieldErrors.email"
        required
      />

      <AppInput
        v-model="register.password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="register.fieldErrors.password"
        required
      />

      <AppInput
        v-model="register.confirmPassword"
        name="confirm-password"
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="register.fieldErrors.confirmPassword"
        required
      />

      <p
        v-if="register.serverError"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ register.serverError }}
      </p>

      <AppButton
        type="submit"
        label="Create account"
        :loading="register.loading"
        :block="true"
        size="lg"
      />
    </form>

    <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
      Already have an account?
      <AppLink :to="{ name: 'login' }">Sign in</AppLink>
    </p>
  </div>
</template>
