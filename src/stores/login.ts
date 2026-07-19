import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { http } from "../api/http.ts";
import { router } from "../router/index.ts";
import { loginSchema } from "../schemas/auth.ts";
import type { AxiosError } from "axios";
import { useUserStore } from "../stores/user.ts";

export const useLoginStore = defineStore("login", () => {
  // State
  const email = ref("");
  const password = ref("");
  const loading = ref(false);
  const serverError = ref("");
  const fieldErrors = ref<Record<string, string>>({});
  const token = ref<string | null>(localStorage.getItem("token"));
  const refreshToken = ref<string | null>(localStorage.getItem("refreshToken"));

  // Getters
  const isAuthenticated = computed(() => !!token.value);

  // Actions
  async function login() {
    serverError.value = "";
    fieldErrors.value = {};

    const result = loginSchema.safeParse({
      email: email.value,
      password: password.value,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      fieldErrors.value = {
        email: flat.email?.[0] ?? "",
        password: flat.password?.[0] ?? "",
      };
      return;
    }

    loading.value = true;
    try {
      const { data } = await http.post<{ token: string; refreshToken: string }>("/auth/login", {
        email: result.data.email,
        password: result.data.password,
      });

      token.value = data.token;
      refreshToken.value = data.refreshToken;
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      await router.push({ name: "dashboard" });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      serverError.value =
        axiosErr.response?.data?.message ??
        "Login failed. Please check your credentials.";
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await http.post("/auth/logout", { refreshToken: refreshToken.value });

      token.value = null;
      refreshToken.value = null;
      email.value = "";
      password.value = "";
      serverError.value = "";
      fieldErrors.value = {};
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      useUserStore().resetSession();
      await router.push({ name: "login" });
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      serverError.value = axiosErr.response?.data?.error ?? "Logout failed.";
    } finally {
      loading.value = false;
    }
  }

  return {
    email,
    password,
    loading,
    serverError,
    fieldErrors,
    token,
    refreshToken,
    isAuthenticated,
    login,
    logout,
  };
});
