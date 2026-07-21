<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.ts";
import type { UserSummary } from "../types/user.ts";
import { debounce } from "../helpers/debounce.ts";
import AppHeader from "../components/ui/AppHeader.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppInput from "../components/ui/AppInput.vue";
import AppModal from "../components/ui/AppModal.vue";
import AppSelect from "../components/ui/AppSelect.vue";
import AppPagination from "../components/ui/AppPagination.vue";
import UserListItem from "../components/ui/UserListItem.vue";

const router = useRouter();
const user = useUserStore();

onMounted(() => {
  user.fetchUsers();
});

// Sort field options
const sortItems = [
  { label: "Email", value: "email" },
  { label: "Display Name", value: "displayName" },
  { label: "Role", value: "role" },
  { label: "Created At", value: "createdAt" },
];

const onSearchInput = debounce((val: string) => {
  user.search = val;
  user.currentPage = 1;
  user.fetchUsers();
}, 300);

function navigateToUser(id: string) {
  router.push({ name: "user-detail", params: { id } });
}

// Edit modal
const editOpen = ref(false);
const editTarget = ref<UserSummary | null>(null);
const editDisplayName = ref("");

function openEdit(u: UserSummary) {
  editTarget.value = u;
  editDisplayName.value = u.displayName;
  editOpen.value = true;
}

async function submitEdit() {
  if (!editTarget.value) return;
  try {
    await user.updateUser(editTarget.value.id, {
      displayName: editDisplayName.value,
    });
    editOpen.value = false;
    editTarget.value = null;
  } catch {
    // actionError is set in store
  }
}

// Delete modal
const deleteOpen = ref(false);
const deleteTarget = ref<UserSummary | null>(null);

function openDelete(u: UserSummary) {
  deleteTarget.value = u;
  deleteOpen.value = true;
}

async function submitDelete() {
  if (!deleteTarget.value) return;
  try {
    await user.deleteUser(deleteTarget.value.id);
    deleteOpen.value = false;
    deleteTarget.value = null;
  } catch {
    // actionError is set in store
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Back button -->
      <button
        type="button"
        class="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        @click="router.push({ name: 'dashboard' })"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Back to Dashboard
      </button>

      <!-- Page heading -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Manage all registered users.
        </p>
      </div>

      <!-- Toolbar -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 min-w-48">
          <UInput
            :model-value="user.search"
            placeholder="Search users…"
            icon="i-lucide-search"
            size="sm"
            class="w-full"
            @update:model-value="onSearchInput"
          />
        </div>

        <!-- Sort field -->
        <AppSelect
          :model-value="user.sortBy"
          :items="sortItems"
          icon="i-lucide-arrow-up-down"
          placeholder="Sort by"
          size="sm"
          @update:model-value="user.setSortBy"
        />

        <!-- Sort direction toggle -->
        <UButton
          :icon="user.sortDesc ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
          size="sm"
          color="neutral"
          variant="outline"
          :aria-label="user.sortDesc ? 'Descending' : 'Ascending'"
          @click="user.toggleSortDesc"
        />
      </div>

      <!-- Loading state -->
      <div
        v-if="user.usersLoading"
        class="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400"
      >
        <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin mr-2" />
        Loading users…
      </div>

      <!-- Error state -->
      <div
        v-else-if="user.usersError"
        class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
      >
        {{ user.usersError }}
      </div>

      <!-- Users list -->
      <ul
        v-else-if="user.users.length"
        class="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
      >
        <UserListItem
          v-for="u in user.users"
          :key="u.id"
          :user="u"
          :current-user-id="user.profile?.id"
          :clickable="true"
          :show-date="true"
          @click="navigateToUser(u.id)"
        >
          <template v-if="u.id !== user.profile?.id" #actions>
            <!-- Edit -->
            <UButton
              icon="i-lucide-pencil"
              size="xs"
              color="neutral"
              variant="ghost"
              aria-label="Edit user"
              @click.stop="openEdit(u)"
            />
            <!-- Delete -->
            <UButton
              icon="i-lucide-trash-2"
              size="xs"
              color="error"
              variant="ghost"
              aria-label="Delete user"
              @click.stop="openDelete(u)"
            />
          </template>
          <template v-else #actions>
            <!-- Placeholder to preserve width for current user row -->
            <span class="size-[24px]" />
            <span class="size-[24px]" />
          </template>
        </UserListItem>
      </ul>

      <!-- Empty state -->
      <div
        v-else
        class="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-900"
      >
        <UIcon
          name="i-lucide-users"
          class="mx-auto size-10 text-gray-300 dark:text-gray-600"
        />
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          No users found.
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="user.totalUsers && user.totalUsers > user.pageSize"
        class="mt-6 flex justify-center"
      >
        <AppPagination
          :page="user.currentPage"
          :total="user.totalUsers"
          :items-per-page="user.pageSize"
          :sibling-count="1"
          show-edges
          @update:page="user.setPage"
        />
      </div>
    </main>

    <!-- Edit modal -->
    <AppModal
      v-model:open="editOpen"
      title="Edit Display Name"
      description="Update the display name for this user."
    >
      <template #body>
        <div class="space-y-4">
          <AppInput
            v-model="editDisplayName"
            label="Display Name"
            placeholder="Enter display name"
            name="displayName"
          />
          <p
            v-if="user.actionError"
            class="text-sm text-red-600 dark:text-red-400"
          >
            {{ user.actionError }}
          </p>
        </div>
      </template>
      <template #footer="{ close }">
        <AppButton
          label="Cancel"
          color="neutral"
          variant="outline"
          size="sm"
          @click="close"
        />
        <AppButton
          label="Save"
          color="primary"
          variant="solid"
          size="sm"
          :loading="user.actionLoading"
          :disabled="!editDisplayName.trim()"
          @click="submitEdit"
        />
      </template>
    </AppModal>

    <!-- Delete confirm modal -->
    <AppModal v-model:open="deleteOpen" title="Delete User">
      <template #body>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to delete
          <span class="font-semibold">{{ deleteTarget?.displayName }}</span
          >? This action cannot be undone.
        </p>
        <p
          v-if="user.actionError"
          class="mt-3 text-sm text-red-600 dark:text-red-400"
        >
          {{ user.actionError }}
        </p>
      </template>
      <template #footer="{ close }">
        <AppButton
          label="Cancel"
          color="neutral"
          variant="outline"
          size="sm"
          @click="close"
        />
        <AppButton
          label="Delete"
          color="error"
          variant="solid"
          size="sm"
          :loading="user.actionLoading"
          @click="submitDelete"
        />
      </template>
    </AppModal>
  </div>
</template>
