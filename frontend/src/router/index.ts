import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AuthView from "../views/AuthView.vue";
import ReportsView from "../views/ReportsView.vue";
import RetrieveAccount from "../views/RetrieveAccount.vue";
import ProfileEditView from "../views/ProfileEditView.vue";
import HomeView from "../views/HomeView.vue";
import PageNotFoundView from "../views/PageNotFoundView.vue";
import UsersView from "../views/UsersView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import CreateUserView from "../views/CreateUserView.vue";
import InitialRegisterUserInfos from "../views/InitialRegisterUserInfos.vue";
import store from "../store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: { path: "/users" },
  },
  {
    path: "/home",
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
    path: "/profile",
    name: "profile",
    component: ProfileEditView,
  },
  {
    path: "/reports",
    name: "reports",
    component: ReportsView,
    props: {
      showingTab: "reports",
    },
  },
  {
    path: "/charts",
    name: "charts",
    component: ReportsView,
    props: {
      showingTab: "charts",
    },
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
    component: CreateUserView,
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

router.beforeEach((to: any, from, next) => {
  const auth = store.state.auth;
  if (
    ![
      "login",
      "initial-register-infos",
      "change-password",
      "retrieve-account",
    ].includes(to.name) &&
    !auth
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
