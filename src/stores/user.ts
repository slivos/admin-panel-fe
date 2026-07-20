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

export type SortField = "email" | "displayName" | "role" | "createdAt";

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

  // Users list state
  const users = ref<UserSummary[]>([]);
  const totalUsers = ref<number | null>(null);
  const totalPages = ref(0);
  const usersLoading = ref(false);
  const usersError = ref("");

  // Pagination & filter state
  const currentPage = ref(1);
  const pageSize = ref(20);
  const search = ref("");
  const sortBy = ref<SortField>("createdAt");
  const sortDesc = ref(false);

  // Single user detail state
  const detail = ref<UserSummary | null>(null);
  const detailLoading = ref(false);
  const detailError = ref("");

  // Single-action loading/error (for delete, update)
  const actionLoading = ref(false);
  const actionError = ref("");

  async function fetchMe() {
    loading.value = true;
    error.value = "";
    try {
      const { data } = await http.get<UserSummary>("/users/me");
      profile.value = data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      error.value =
        axiosErr.response?.data?.message ?? "Failed to load profile.";
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
    usersError.value = "";
    try {
      const { data } = await http.get<PagedResult<UserSummary>>("/users", {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          search: search.value || undefined,
          sortBy: sortBy.value,
          sortDesc: sortDesc.value,
        },
      });
      users.value = data.items;
      totalUsers.value = data.totalCount;
      totalPages.value = data.totalPages;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      usersError.value =
        axiosErr.response?.data?.message ?? "Failed to load users.";
    } finally {
      usersLoading.value = false;
    }
  }

  async function fetchUserById(id: string): Promise<void> {
    detailLoading.value = true;
    detailError.value = "";
    detail.value = null;
    try {
      const { data } = await http.get<UserSummary>(`/users/${id}`);
      detail.value = data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      detailError.value =
        axiosErr.response?.data?.message ??
        "User not found or you do not have permission to view this profile.";
    } finally {
      detailLoading.value = false;
    }
  }

  async function deleteUser(id: string): Promise<void> {
    actionLoading.value = true;
    actionError.value = "";
    try {
      await http.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      actionError.value =
        axiosErr.response?.data?.message ?? "Failed to delete user.";
      throw axiosErr;
    } finally {
      actionLoading.value = false;
    }
  }

  async function updateUser(
    id: string,
    payload: { displayName: string },
  ): Promise<void> {
    actionLoading.value = true;
    actionError.value = "";
    try {
      await http.put(`/users/${id}`, payload);
      await fetchUsers();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      actionError.value =
        axiosErr.response?.data?.message ?? "Failed to update user.";
      throw axiosErr;
    } finally {
      actionLoading.value = false;
    }
  }

  function setSortBy(val: string): void {
    sortBy.value = val as SortField;
    currentPage.value = 1;
    fetchUsers();
  }

  function toggleSortDesc(): void {
    sortDesc.value = !sortDesc.value;
    currentPage.value = 1;
    fetchUsers();
  }

  function setPage(page: number): void {
    currentPage.value = page;
    fetchUsers();
  }

  return {
    profile,
    loading,
    error,
    isAdmin,
    fetchMe,
    resetSession,
    // list
    users,
    totalUsers,
    totalPages,
    usersLoading,
    usersError,
    fetchUsers,
    // filters
    currentPage,
    pageSize,
    search,
    sortBy,
    sortDesc,
    // actions
    actionLoading,
    actionError,
    fetchUserById,
    detail,
    detailLoading,
    detailError,
    deleteUser,
    updateUser,
    setSortBy,
    toggleSortDesc,
    setPage,
  };
});
