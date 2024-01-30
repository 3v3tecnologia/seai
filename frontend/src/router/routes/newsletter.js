import BaseForm from "@/views/BaseForm.vue";
import { actionPrefix, modulesSystem, modulesSystemLevel } from "@/constants";
import BaseCrudView from "@/views/templates/BaseCrudView.vue";
import routeProps from "@/router/props";

export default [
  {
    path: "/newsletter",
    name: "newsletter",
    meta: {
      ShowNav: true,
      title: `Notícias`,
      modulesNeeded: [modulesSystem.news, modulesSystemLevel.read],
    },
    component: BaseCrudView,
    props: routeProps.newsletter.list,
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
    path: "/newsletter/create",
    name: "create-newsletter",
    meta: {
      title: `${actionPrefix.create} notícia`,
      modulesNeeded: [modulesSystem.news, modulesSystemLevel.write],
    },
    component: BaseForm,
    props: routeProps.newsletter.create,
  },
].map((r) => {
  r.meta.navBarTab = 3;

  return r;
});
