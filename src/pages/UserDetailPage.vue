<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user.ts";
import AppHeader from "../components/ui/AppHeader.vue";
import AppCard from "../components/ui/AppCard.vue";
import UserAvatar from "../components/ui/UserAvatar.vue";

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const { detail, detailLoading, detailError } = storeToRefs(user);

onMounted(() => {
  const id = route.params.id as string;
  user.fetchUserById(id);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Back button -->
      <button
        type="button"
        class="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        @click="router.push({ name: 'users' })"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Back to Users
      </button>

      <!-- Loading -->
      <div
        v-if="detailLoading"
        class="flex items-center gap-2 text-gray-500 dark:text-gray-400"
      >
        <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
        Loading user…
      </div>

      <!-- Error -->
      <div
        v-else-if="detailError"
        class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
      >
        {{ detailError }}
      </div>

      <!-- Content -->
      <template v-else-if="detail">
        <div class="mb-8 flex items-center gap-4">
          <!-- Avatar -->
          <UserAvatar :name="detail.displayName" size="lg" />

          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ detail.displayName }}
            </h1>
            <div class="mt-1 flex items-center gap-2">
              <UBadge
                :label="detail.role"
                :color="detail.role === 'Admin' ? 'primary' : 'neutral'"
                variant="subtle"
              />
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ detail.email }}</span>
            </div>
          </div>
        </div>

        <!-- Detail card -->
        <AppCard class="max-w-lg">
          <dl class="divide-y divide-gray-100 dark:divide-gray-800">
            <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Display Name</dt>
              <dd class="text-base font-semibold text-gray-900 dark:text-white">
                {{ detail.displayName }}
              </dd>
            </div>

            <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
              <dd class="text-base text-gray-900 dark:text-white">{{ detail.email }}</dd>
            </div>

            <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
              <dd>
                <UBadge
                  :label="detail.role"
                  :color="detail.role === 'Admin' ? 'primary' : 'neutral'"
                  variant="subtle"
                />
              </dd>
            </div>

            <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</dt>
              <dd class="font-mono text-sm text-gray-700 dark:text-gray-300">{{ detail.id }}</dd>
            </div>

            <div class="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</dt>
              <dd class="text-base text-gray-900 dark:text-white">
                {{ new Date(detail.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) }}
              </dd>
            </div>
          </dl>
        </AppCard>
      </template>
    </main>
  </div>
</template>
