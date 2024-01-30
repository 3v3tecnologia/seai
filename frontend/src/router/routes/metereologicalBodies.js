import BaseForm from "@/views/BaseForm.vue";
import BaseCrudView from "@/views/templates/BaseCrudView.vue";
import { actionPrefix } from "@/constants";
import routeProps from "@/router/props";

export default [
  {
    path: "/meteorological-bodies",
    name: "meteorological-bodies",
    meta: {
      ShowNav: true,
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
].map((r) => {
  r.meta.navBarTab = 1;

  return r;
});
