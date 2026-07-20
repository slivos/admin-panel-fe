import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import AuthLayout from "../layouts/AuthLayout.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import UserDetailPage from "../pages/UserDetailPage.vue";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
      },
      {
        path: "register",
        name: "register",
        component: RegisterPage,
      },
    ],
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "users",
    component: UsersPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/users/:id",
    name: "user-detail",
    component: UserDetailPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      return { name: "login" };
    }
  }

  if (to.meta.requiresAdmin) {
    const { useUserStore } = await import("../stores/user.ts");
    const store = useUserStore();
    if (!store.profile && !store.loading) {
      await store.fetchMe();
    }
    if (!store.isAdmin) {
      return { name: "dashboard" };
    }
  }
});
