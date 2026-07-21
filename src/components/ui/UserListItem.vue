<script setup lang="ts">
import type { UserSummary } from "../../types/user.ts";
import UserAvatar from "./UserAvatar.vue";

type AvatarSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    user: UserSummary;
    currentUserId?: string;
    clickable?: boolean;
    showDate?: boolean;
    avatarSize?: AvatarSize;
  }>(),
  {
    currentUserId: undefined,
    clickable: false,
    showDate: false,
    avatarSize: "md",
  },
);

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <li
    class="group relative flex items-center gap-4 px-5 py-3 transition-colors"
    :class="{ 'hover:bg-gray-50 dark:hover:bg-gray-800/50 py-3.5': clickable }"
  >
    <!-- Clickable left side (UsersPage) or plain display (DashboardPage) -->
    <component
      :is="clickable ? 'button' : 'div'"
      v-bind="clickable ? { type: 'button' } : {}"
      class="flex min-w-0 flex-1 items-center gap-4"
      :class="{ 'text-left': clickable }"
      @click="clickable ? emit('click') : undefined"
    >
      <!-- Avatar -->
      <UserAvatar :name="user.displayName" :size="avatarSize" />

      <!-- Name + email -->
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
          {{ user.displayName }}
        </p>
        <p class="truncate text-xs text-gray-500 dark:text-gray-400">
          {{ user.email }}
        </p>
      </div>

      <!-- Role badge -->
      <UBadge
        :label="user.role"
        :color="user.role === 'Admin' ? 'primary' : 'neutral'"
        variant="subtle"
        size="sm"
        class="shrink-0"
      />

      <!-- "Me" badge -->
      <UBadge
        v-if="currentUserId && user.id === currentUserId"
        label="Me"
        color="info"
        variant="subtle"
        size="sm"
        class="shrink-0"
      />

      <!-- Created at -->
      <span
        v-if="showDate"
        class="hidden shrink-0 text-xs text-gray-400 dark:text-gray-500 sm:block"
      >
        {{ new Date(user.createdAt).toLocaleDateString() }}
      </span>
    </component>

    <!-- Actions slot (e.g. edit/delete buttons in UsersPage) -->
    <div
      v-if="$slots.actions"
      class="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
    >
      <slot name="actions" />
    </div>
  </li>
</template>
