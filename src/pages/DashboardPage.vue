<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useUserStore } from "../stores/user.ts";
import AppHeader from "../components/ui/AppHeader.vue";
import AppLink from "../components/ui/AppLink.vue";

const user = useUserStore();

const adminCards = computed(() => [
  { title: "Total Users", value: user.totalUsers ?? "—" },
  { title: "Active Sessions", value: "—" },
  { title: "Pending Tasks", value: "—" },
]);

onMounted(() => {
  if (user.isAdmin) {
    user.fetchUsers();
  }
});

watch(
  () => user.isAdmin,
  (isAdmin) => {
    if (isAdmin && user.totalUsers === null) {
      user.fetchUsers();
    }
  },
);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back<template v-if="user.profile?.displayName"
            >, {{ user.profile.displayName }}</template
          >
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          You're signed in. Here's what's happening with your admin panel today.
        </p>
      </div>

      <!-- Admin: stat cards -->
      <div v-if="user.isAdmin" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="card in adminCards"
          :key="card.title"
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ card.title }}
          </p>
          <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {{ card.value }}
          </p>
        </div>
      </div>

      <!-- User: settings link -->
      <div v-if="user.profile" class="mt-10">
        <AppLink to="/settings">Settings</AppLink>
      </div>
    </main>
  </div>
</template>
