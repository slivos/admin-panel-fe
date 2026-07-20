<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useUserStore } from "../stores/user.ts";
import { initials } from "../helpers/string.ts";
import AppHeader from "../components/ui/AppHeader.vue";
import AppLink from "../components/ui/AppLink.vue";

const user = useUserStore();

const adminCards = computed(() => [
  { title: "Total Users", value: user.totalUsers ?? "—" },
]);

const recentUsers = computed(() => user.users.slice(0, 5));

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

      <!-- Admin: recent users list -->
      <div v-if="user.isAdmin" class="mt-10">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Users
          </h2>
          <AppLink to="/users">View all users →</AppLink>
        </div>

        <div
          v-if="user.usersLoading"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          Loading…
        </div>

        <ul
          v-else-if="recentUsers.length"
          class="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
        >
          <li
            v-for="u in recentUsers"
            :key="u.id"
            class="flex items-center gap-4 px-5 py-3"
          >
            <!-- Initials avatar -->
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300"
            >
              {{ initials(u.displayName) }}
            </span>

            <!-- Name + email -->
            <div class="min-w-0 flex-1">
              <p
                class="truncate text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ u.displayName }}
              </p>
              <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                {{ u.email }}
              </p>
            </div>

            <!-- Role badge -->
            <UBadge
              :label="u.role"
              :color="u.role === 'Admin' ? 'primary' : 'neutral'"
              variant="subtle"
              size="sm"
            />

            <!-- "Me" badge -->
            <UBadge
              v-if="u.id === user.profile?.id"
              label="Me"
              color="info"
              variant="subtle"
              size="sm"
            />
          </li>
        </ul>

        <p v-else class="text-sm text-gray-500 dark:text-gray-400">
          No users found.
        </p>
      </div>

      <!-- User: settings link -->
      <div v-if="user.profile" class="mt-10">
        <AppLink to="/settings">Settings</AppLink>
      </div>
    </main>
  </div>
</template>
