import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "@nuxt/ui/composables/useToast";
import { http } from "../api/http.ts";
import { changePasswordSchema } from "../schemas/changePassword.ts";
import type { AxiosError } from "axios";

export const useChangePasswordStore = defineStore("changePassword", () => {
  const toast = useToast();

  // State
  const currentPassword = ref("");
  const newPassword = ref("");
  const confirmNewPassword = ref("");
  const loading = ref(false);
  const serverError = ref("");
  const fieldErrors = ref<{
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  // Actions
  async function changePassword() {
    serverError.value = "";
    fieldErrors.value = {};

    const result = changePasswordSchema.safeParse({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmNewPassword: confirmNewPassword.value,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      fieldErrors.value = {
        currentPassword: flat.currentPassword?.[0],
        newPassword: flat.newPassword?.[0],
        confirmNewPassword: flat.confirmNewPassword?.[0],
      };
      return;
    }

    loading.value = true;
    try {
      await http.post("/auth/change-password", {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      });

      currentPassword.value = "";
      newPassword.value = "";
      confirmNewPassword.value = "";

      toast.add({ title: "Password changed successfully.", color: "success" });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      serverError.value =
        axiosErr.response?.data?.message ?? "Failed to change password. Please try again.";
    } finally {
      loading.value = false;
    }
  }

  return {
    currentPassword,
    newPassword,
    confirmNewPassword,
    loading,
    serverError,
    fieldErrors,
    changePassword,
  };
});
