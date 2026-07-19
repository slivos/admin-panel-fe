<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.ts";
import AppHeader from "../components/ui/AppHeader.vue";

const router = useRouter();
const user = useUserStore();
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

      <div
        v-if="user.profile"
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 max-w-md"
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
      </div>

      <div v-else-if="user.loading" class="text-gray-500 dark:text-gray-400">
        Loading…
      </div>

      <div v-else-if="user.error" class="text-red-500">
        {{ user.error }}
      </div>
    </main>
  </div>
</template>
