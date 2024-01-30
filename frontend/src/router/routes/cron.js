import BaseForm from "@/views/BaseForm.vue";
import BaseCrudView from "@/views/templates/BaseCrudView.vue";
import { actionPrefix, modulesSystem, modulesSystemLevel } from "@/constants";
import routeProps from "@/router/props";

export default [
  {
    path: "/cron/",
    name: "cron",
    meta: {
      ShowNav: true,
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
].map((r) => {
  r.meta.navBarTab = 6;

  return r;
});
