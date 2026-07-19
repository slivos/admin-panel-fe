<script setup lang="ts">
import { useLoginStore } from "../../stores/login.ts";
import AppButton from "./AppButton.vue";

const auth = useLoginStore();
</script>

<template>
  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <span class="text-lg font-semibold text-gray-900 dark:text-white">
        Admin Panel
      </span>
      <AppButton
        label="Sign out"
        variant="ghost"
        size="sm"
        @click="auth.logout"
      />
    </div>
  </header>
</template>
