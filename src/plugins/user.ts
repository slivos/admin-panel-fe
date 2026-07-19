import type { App } from "vue";
import { router } from "../router/index.ts";
import { useUserStore } from "../stores/user.ts";

export const userPlugin = {
  install(_app: App) {
    router.afterEach((to) => {
      if (to.meta.requiresAuth && localStorage.getItem("token")) {
        const store = useUserStore();
        if (!store.profile && !store.loading) {
          store.fetchMe();
        }
      }
    });
  },
};
