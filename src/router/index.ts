import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import AuthLayout from "../layouts/AuthLayout.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";

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
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      return { name: "login" };
    }
  }
});
