import { defineStore } from "pinia";
import { ref } from "vue";
import { http } from "../api/http.ts";
import { router } from "../router/index.ts";
import { registerSchema } from "../schemas/auth.ts";
import type { AxiosError } from "axios";

export const useRegisterStore = defineStore("register", () => {
  // State
  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const displayName = ref("");
  const loading = ref(false);
  const serverError = ref("");
  const fieldErrors = ref<Record<string, string>>({});

  // Actions
  async function register() {
    serverError.value = "";
    fieldErrors.value = {};

    const result = registerSchema.safeParse({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      displayName: displayName.value || undefined,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      fieldErrors.value = {
        email: flat.email?.[0] ?? "",
        password: flat.password?.[0] ?? "",
        confirmPassword: flat.confirmPassword?.[0] ?? "",
        displayName: flat.displayName?.[0] ?? "",
      };
      return;
    }

    loading.value = true;
    try {
      await http.post("/auth/register", {
        email: result.data.email,
        password: result.data.password,
        displayName: result.data.displayName,
      });

      await router.push({ name: "login" });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      serverError.value =
        axiosErr.response?.data?.message ??
        "Registration failed. Please try again.";
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    displayName.value = "";
    serverError.value = "";
    fieldErrors.value = {};
  }

  return {
    email,
    password,
    confirmPassword,
    displayName,
    loading,
    serverError,
    fieldErrors,
    register,
    reset,
  };
});
