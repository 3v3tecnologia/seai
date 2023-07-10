import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AuthView from "../views/AuthView.vue";
import ReportsView from "../views/ReportsView.vue";
import RetrieveAccount from "../views/RetrieveAccount.vue";
import EditUserView from "../views/EditUserView.vue";
import HomeView from "../views/HomeView.vue";
import PageNotFoundView from "../views/PageNotFoundView.vue";
import UsersView from "../views/UsersView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import CreateUserView from "../views/CreateUserView.vue";
import InitialRegisterUserInfos from "../views/InitialRegisterUserInfos.vue";

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
    path: "/reports",
    name: "reports",
    component: ReportsView,
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePasswordView,
  },
  {
    path: "/users/create-user",
    name: "create-user",
    component: CreateUserView,
  },
  {
    path: "/user/edit/:id",
    name: "edit-user",
    component: EditUserView,
  },
  {
    path: "/retrieve-account",
    name: "retrieve-account",
    component: RetrieveAccount,
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
    children: [],
  },
  {
    path: "/initial-register-infos",
    name: "initial-register-infos",
    component: InitialRegisterUserInfos,
  },
  { path: "/:catchAll(.*)", component: PageNotFoundView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
