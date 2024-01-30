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
import { retrieveToken } from "@/helpers/auth";
import { actionPrefix, modulesSystem, modulesSystemLevel } from "@/constants";
import { toast } from "vue3-toastify";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: { path: "/users" },
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: ``,
    },
    component: AuthView,
  },
  {
    path: "/profile",
    name: "profile",
    meta: {
      title: `Perfil`,
    },
    component: BaseForm,
    props: routeProps.profile,
  },
  {
    path: "/meteorological-bodies",
    name: "meteorological-bodies",
    meta: {
      title: `Órgãos meteorológicos`,
    },
    component: BaseCrudView,
    props: routeProps.metereologicalBodies.list,
  },
  {
    path: "/meteorological-bodies/edit/:id",
    name: "edit-body",
    meta: {
      title: `${actionPrefix.edit} órgão meteorológico`,
    },
    component: BaseForm,
    props: routeProps.metereologicalBodies.update,
  },
  {
    path: "/meteorological-bodies/create",
    name: "create-body",
    meta: {
      title: `${actionPrefix.create} órgão meteorológico`,
    },
    component: BaseForm,
    props: routeProps.metereologicalBodies.create,
  },
  {
    path: "/equipments",
    name: "equipments",
    meta: {
      title: `Equipamentos`,
    },
    component: BaseCrudView,
    props: routeProps.equipments.list,
  },
  {
    path: "/station-reads/:id",
    name: "station-reads",
    meta: {
      title: `Leituras de estação`,
    },
    component: BaseCrudView,
    props: routeProps.reads.station.list,
  },
  {
    path: "/station-reads-edit/:id",
    name: "station-reads-edit",
    meta: {
      title: `${actionPrefix.edit} leituras de estação`,
    },
    component: BaseForm,
    props: routeProps.reads.station.update,
  },
  {
    path: "/pluviometer-reads/:id",
    name: "pluviometer-reads",
    meta: {
      title: `Leituras de pluviômetro`,
    },
    component: BaseCrudView,
    props: routeProps.reads.pluviometer.list,
  },
  {
    path: "/pluviometer-reads/edit/:id",
    name: "pluviometer-reads-edit",
    meta: {
      title: `${actionPrefix.edit} leituras de pluviômetros`,
    },
    component: BaseForm,
    props: routeProps.reads.pluviometer.update,
  },
  {
    path: "/newsletter/edit/:id",
    name: "edit-newsletter",
    meta: {
      title: `${actionPrefix.edit} notícia`,
      modulesNeeded: [modulesSystem.news, modulesSystemLevel.write],
    },
    component: BaseForm,
    props: routeProps.newsletter.update,
  },
  {
    path: "/newsletter",
    name: "newsletter",
    meta: {
      title: `Notícias`,
      modulesNeeded: [modulesSystem.news, modulesSystemLevel.read],
    },
    component: BaseCrudView,
    props: routeProps.newsletter.list,
  },
  {
    path: "/newsletter/create",
    name: "create-newsletter",
    meta: {
      title: `${actionPrefix.create} notícia`,
      modulesNeeded: [modulesSystem.news, modulesSystemLevel.write],
    },
    component: BaseForm,
    props: routeProps.newsletter.create,
  },
  {
    path: "/equipments/edit/:id",
    name: "edit-equipment",
    meta: {
      title: `${actionPrefix.edit} equipamento`,
    },
    component: BaseForm,
    props: routeProps.equipments.update,
  },
  {
    path: "/equipments/create",
    name: "create-equipment",
    meta: {
      title: `${actionPrefix.create} equipamento`,
    },
    component: BaseForm,
    props: routeProps.equipments.create,
  },
  {
    path: "/reports",
    name: "reports",
    meta: {
      title: `Relatórios`,
    },
    component: ReportsView,
  },
  {
    path: "/charts",
    name: "charts",
    meta: {
      title: `Gráficos`,
    },
    component: ReportsView,
    props: {
      showingTab: "charts",
    },
  },
  {
    path: "/change-password",
    name: "change-password",
    meta: {
      title: `Trocar senha`,
    },
    component: ChangePasswordView,
  },
  {
    path: "/users/create",
    name: "create-user",
    meta: {
      title: `${actionPrefix.create} usuário`,
      modulesNeeded: [modulesSystem.user, modulesSystemLevel.write],
    },
    component: CreateUserView,
  },
  {
    path: "/users/edit/:id",
    name: "edit-user",
    meta: {
      title: `${actionPrefix.edit} usuário`,
      modulesNeeded: [modulesSystem.user, modulesSystemLevel.write],
    },
    component: CreateUserView,
  },
  {
    path: "/retrieve-account",
    name: "retrieve-account",
    meta: {
      title: `Recuperar conta`,
    },
    component: RetrieveAccount,
  },
  {
    path: "/users",
    name: "users",
    meta: {
      title: `Usuários`,
      modulesNeeded: [modulesSystem.user, modulesSystemLevel.read],
    },
    component: BaseCrudView,
    props: routeProps.user,
  },
  {
    path: "/initial-register-infos",
    name: "initial-register-infos",
    meta: {
      title: `Concluir cadastro`,
    },
    component: InitialRegisterUserInfos,
  },
  {
    path: "/cron/",
    name: "cron",
    meta: {
      title: `Rotina de dados`,
      modulesNeeded: [modulesSystem.jobs, modulesSystemLevel.read],
    },
    component: BaseCrudView,
    props: routeProps.cron.list,
  },
  {
    path: "/cron/edit/:id",
    name: "edit-cron",
    meta: {
      title: `${actionPrefix.edit} rotina de dados`,
      modulesNeeded: [modulesSystem.jobs, modulesSystemLevel.write],
    },
    component: BaseForm,
    props: routeProps.cron.update,
  },
  {
    path: "/cron/create",
    name: "create-cron",
    meta: {
      title: `${actionPrefix.create} rotina de dados`,
      modulesNeeded: [modulesSystem.jobs, modulesSystemLevel.write],
    },
    component: BaseForm,
    props: routeProps.cron.create,
  },
  {
    path: "/status/",
    name: "status",
    meta: {
      title: `Status de rotina`,
      modulesNeeded: [modulesSystem.jobs, modulesSystemLevel.read],
    },
    component: BaseCrudView,
    props: routeProps.status.list,
  },
  {
    path: "/status/edit/:id",
    name: "edit-status",
    meta: {
      title: `${actionPrefix.edit} status`,
      modulesNeeded: [modulesSystem.jobs, modulesSystemLevel.write],
    },
    component: BaseForm,
    props: routeProps.status.update,
  },
  {
    path: "/status/create",
    name: "create-status",
    meta: {
      title: `${actionPrefix.create} status`,
      modulesNeeded: [modulesSystem.jobs, modulesSystemLevel.write],
    },
    component: BaseForm,
    props: routeProps.status.create,
  },
  {
    path: "/:catchAll(.*)",
    meta: {
      title: `Rota não encontrada`,
    },
    component: PageNotFoundView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to: any, from, next) => {
  let auth = store.state.auth;
  let profile: any = store.state.profile;

  const openRoutes: { [x: string]: boolean } = {
    "initial-register-infos": true,
    login: true,
    "change-password": true,
    "retrieve-account": true,
  };

  const token = retrieveToken();
  if (!auth && token) {
    await store.dispatch("GET_PROFILE", token);
    auth = store.state.auth;
    profile = store.state.profile;
  }

  await store.dispatch("CLEAR_PAGE_TITLE");

  const modulesNeeded = to.meta.modulesNeeded;

  if (
    profile &&
    modulesNeeded &&
    !profile?.modules?.[modulesNeeded[0]][modulesNeeded[1]]
  ) {
    if (from.path == "/") {
      toast.error("Sem permissão para acessar este módulo");

      setTimeout(() => {
        router.push("reports");
      }, 3000);
    }

    console.log(to, from);
  } else if (!openRoutes[to.name] && !auth) {
    next("/login");
  } else {
    next();
  }
});

const DEFAULT_TITLE = "SEAI";
router.afterEach((to, from) => {
  const documentPage: any = document;
  documentPage.title = [to.meta.title, DEFAULT_TITLE]
    .filter((c) => c)
    .join(" - ");
});

export default router;
