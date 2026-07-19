import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { http } from "../api/http.ts";
import type { AxiosError } from "axios";

export const UserRole = {
  Admin: "Admin",
  User: "User",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const useUserStore = defineStore("user", () => {
  const profile = ref<UserSummary | null>(null);
  const loading = ref(false);
  const error = ref("");

  const isAdmin = computed(() => profile.value?.role === UserRole.Admin);

  const users = ref<UserSummary[]>([]);
  const totalUsers = ref<number | null>(null);
  const usersLoading = ref(false);

  async function fetchMe() {
    loading.value = true;
    error.value = "";
    try {
      const { data } = await http.get<UserSummary>("/users/me");
      profile.value = data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      error.value = axiosErr.response?.data?.message ?? "Failed to load profile.";
    } finally {
      loading.value = false;
    }
  }

  function resetSession() {
    profile.value = null;
    error.value = "";
  }

  async function fetchUsers() {
    usersLoading.value = true;
    try {
      const { data } = await http.get<PagedResult<UserSummary>>("/users");
      users.value = data.items;
      totalUsers.value = data.totalCount;
    } catch {
      // silent — totalUsers stays null, card shows "—"
    } finally {
      usersLoading.value = false;
    }
  }

  return { profile, loading, error, isAdmin, fetchMe, resetSession, users, totalUsers, usersLoading, fetchUsers };
});
