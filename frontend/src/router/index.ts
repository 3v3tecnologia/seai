import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AuthView from "../views/AuthView.vue";
import RetrieveAccount from "../views/RetrieveAccount.vue";
import HomeView from "../views/HomeView.vue";
import PageNotFoundView from "../views/PageNotFoundView.vue";
import AccessHashUrlView from "../views/AccessHashUrlView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    // redirect: { path: "/login" },
  },
  {
    path: "/login",
    name: "login",
    component: AuthView,
  },
  {
    path: "/retrieve-account",
    name: "retrieve-account",
    component: RetrieveAccount,
  },
  { path: "/not-found", component: PageNotFoundView, name: "not-found-page" },
  { path: "/:catchAll(.*)", component: AccessHashUrlView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
