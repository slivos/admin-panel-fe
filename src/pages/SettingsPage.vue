<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.ts";
import { useChangePasswordStore } from "../stores/changePassword.ts";
import AppHeader from "../components/ui/AppHeader.vue";
import AppCard from "../components/ui/AppCard.vue";

const router = useRouter();
const user = useUserStore();
const changePassword = useChangePasswordStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        @click="router.back()"
        class="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Back
      </button>

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Your profile information.
        </p>
      </div>

      <AppCard
        v-if="user.profile"
        class="max-w-md"
      >
        <dl class="divide-y divide-gray-100 dark:divide-gray-800">
          <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Display name</dt>
            <dd class="text-base font-semibold text-gray-900 dark:text-white">{{ user.profile.displayName }}</dd>
          </div>
          <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd class="text-base text-gray-900 dark:text-white">{{ user.profile.email }}</dd>
          </div>
          <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
            <dd class="text-base text-gray-900 dark:text-white">{{ user.profile.role }}</dd>
          </div>
          <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Member since</dt>
            <dd class="text-base text-gray-900 dark:text-white">
              {{ new Date(user.profile.createdAt).toLocaleDateString() }}
            </dd>
          </div>
        </dl>
      </AppCard>

      <div v-else-if="user.loading" class="text-gray-500 dark:text-gray-400">
        Loading…
      </div>

      <div v-else-if="user.error" class="text-red-500">
        {{ user.error }}
      </div>

      <AppCard class="mt-8 max-w-md">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Change password</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your account password.
          </p>
        </div>

        <form class="space-y-5" novalidate @submit.prevent="changePassword.changePassword">
          <AppInput
            v-model="changePassword.currentPassword"
            label="Current password"
            type="password"
            placeholder="Enter current password"
            autocomplete="current-password"
            :error="changePassword.fieldErrors.currentPassword"
            required
          />
          <AppInput
            v-model="changePassword.newPassword"
            label="New password"
            type="password"
            placeholder="Enter new password"
            autocomplete="new-password"
            :error="changePassword.fieldErrors.newPassword"
            required
          />
          <AppInput
            v-model="changePassword.confirmNewPassword"
            label="Confirm new password"
            type="password"
            placeholder="Confirm new password"
            autocomplete="new-password"
            :error="changePassword.fieldErrors.confirmNewPassword"
            required
          />
          <p
            v-if="changePassword.serverError"
            class="text-sm text-red-600 dark:text-red-400"
          >
            {{ changePassword.serverError }}
          </p>
          <AppButton
            type="submit"
            label="Change password"
            :loading="changePassword.loading"
            :block="true"
            size="lg"
          />
        </form>
      </AppCard>
    </main>
  </div>
</template>
