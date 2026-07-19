<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Logo / App name -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Admin Panel
        </h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your workspace
        </p>
      </div>

      <!-- Auth card -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 px-8 py-10">
        <RouterView />
      </div>
    </div>
  </div>
</template>
