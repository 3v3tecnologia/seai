import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AuthView from "../views/AuthView.vue";
import ReportsView from "../views/ReportsView.vue";
import RetrieveAccount from "../views/RetrieveAccount.vue";
import BaseForm from "../views/BaseForm.vue";
import HomeView from "../views/HomeView.vue";
import PageNotFoundView from "../views/PageNotFoundView.vue";
import BaseCrudView from "../views/BaseCrudView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import CreateUserView from "../views/CreateUserView.vue";
import InitialRegisterUserInfos from "../views/InitialRegisterUserInfos.vue";
import store from "../store";
import routeProps from "./props";

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
    component: BaseForm,
    props: routeProps.profile,
  },
  {
    path: "/metereological-bodies",
    name: "metereological-bodies",
    component: BaseCrudView,
    props: routeProps.metereologicalBodies,
  },
  {
    path: "/metereological-bodies/edit/:id",
    name: "edit-body",
    component: BaseForm,
    props: routeProps.editBody,
  },
  {
    path: "/metereological-bodies/create",
    name: "create-body",
    component: BaseForm,
    props: routeProps.createBody,
  },
  {
    path: "/equipments",
    name: "equipments",
    component: BaseCrudView,
    props: routeProps.equipments,
  },
  {
    path: "/equipments/edit/:id",
    name: "edit-equipment",
    component: BaseForm,
    props: routeProps.editEquipment,
  },
  {
    path: "/equipments/create",
    name: "create-equipment",
    component: BaseForm,
    props: routeProps.createEquipment,
  },
  {
    path: "/reports",
    name: "reports",
    component: ReportsView,
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
    path: "/users/create",
    name: "create-user",
    component: CreateUserView,
  },
  {
    path: "/users/edit/:id",
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
    component: BaseCrudView,
    props: routeProps.user,
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
