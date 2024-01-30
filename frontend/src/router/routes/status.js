import BaseForm from "@/views/BaseForm.vue";
import BaseCrudView from "@/views/templates/BaseCrudView.vue";
import { actionPrefix, modulesSystem, modulesSystemLevel } from "@/constants";
import routeProps from "@/router/props";

export default [
  {
    path: "/status/",
    name: "status",
    meta: {
      ShowNav: true,
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
].map((r) => {
  r.meta.navBarTab = 7;

  return r;
});
