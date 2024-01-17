import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import AuthView from "../views/AuthView.vue";
import ReportsView from "../views/ReportsView/PageView.vue";
import RetrieveAccount from "../views/RetrieveAccount.vue";
import BaseForm from "../views/BaseForm.vue";
import HomeView from "../views/HomeView.vue";
import PageNotFoundView from "../views/PageNotFoundView.vue";
import BaseCrudView from "../views/BaseCrudView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import CreateUserView from "../views/UserRegisterView.vue";
import InitialRegisterUserInfos from "../views/InitialRegisterUserInfos.vue";
import store from "../store";
import routeProps from "./props";
import { isLocalhost } from "@/helpers/url";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: { path: "/users" },
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
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
    path: "/meteorological-bodies",
    name: "meteorological-bodies",
    component: BaseCrudView,
    props: routeProps.metereologicalBodies,
  },
  {
    path: "/meteorological-bodies/edit/:id",
    name: "edit-body",
    component: BaseForm,
    props: routeProps.editBody,
  },
  {
    path: "/meteorological-bodies/create",
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
    path: "/station-reads/:id",
    name: "station-reads",
    component: BaseCrudView,
    props: routeProps.reads.station.list,
  },
  {
    path: "/station-reads-edit/:id",
    name: "station-reads-edit",
    component: BaseForm,
    props: routeProps.reads.station.update,
  },
  {
    path: "/pluviometer-reads/:id",
    name: "pluviometer-reads",
    component: BaseCrudView,
    props: routeProps.reads.pluviometer.list,
  },
  {
    path: "/pluviometer-reads/edit/:id",
    name: "pluviometer-reads-edit",
    component: BaseForm,
    props: routeProps.reads.pluviometer.update,
  },
  {
    path: "/newsletter/edit/:id",
    name: "edit-newsletter",
    component: BaseForm,
    props: routeProps.newsletter.update,
  },
  {
    path: "/newsletter",
    name: "newsletter",
    component: BaseCrudView,
    props: routeProps.newsletter.list,
  },
  {
    path: "/newsletter/create",
    name: "create-newsletter",
    component: BaseForm,
    props: routeProps.newsletter.create,
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
  {
    path: "/cron/",
    name: "cron",
    component: BaseCrudView,
    props: routeProps.cron.list,
  },
  {
    path: "/cron/edit/:id",
    name: "edit-cron",
    component: BaseForm,
    props: routeProps.cron.update,
  },
  {
    path: "/cron/create",
    name: "create-cron",
    component: BaseForm,
    props: routeProps.cron.create,
  },
  {
    path: "/status/",
    name: "status",
    component: BaseCrudView,
    props: routeProps.status.list,
  },
  {
    path: "/status/edit/:id",
    name: "edit-status",
    component: BaseForm,
    props: routeProps.status.update,
  },
  {
    path: "/status/create",
    name: "create-status",
    component: BaseForm,
    props: routeProps.status.create,
  },
  { path: "/:catchAll(.*)", component: PageNotFoundView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to: any, from, next) => {
  let auth = store.state.auth;

  const openRoutes: { [x: string]: boolean } = {
    "initial-register-infos": true,
    login: true,
    "change-password": true,
    "retrieve-account": true,
  };

  if (!auth && isLocalhost()) {
    // TODO
    // IMPLEMENT TOKEN REFRESH
    await store.dispatch("LOGIN_USER", {
      login: "admin",
      password: "1234567",
    });
  }

  auth = store.state.auth;

  if (!openRoutes[to.name] && !auth) {
    next("/login");
  } else {
    next();
  }
});

export default router;
