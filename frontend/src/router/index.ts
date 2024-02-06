import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from "../store";
import { retrieveToken } from "@/helpers/auth";
import { toast } from "vue3-toastify";
import tempRoute from "./routes";

const routes: any = tempRoute;

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

  console.log("acessando url", modulesNeeded, profile);

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
  const current = routes.find((c: any) => c.path === to.path);

  const documentPage: any = document;

  documentPage.title = [to.meta.title, DEFAULT_TITLE]
    .filter((c) => c)
    .join(" - ");

  const currentTab = current?.meta?.navBarTab ?? -1;

  store.commit("SET_CURRENT_TAB", currentTab);
});

export default router;
