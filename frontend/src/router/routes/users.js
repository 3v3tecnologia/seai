import BaseCrudView from "@/views/templates/BaseCrudView.vue";
import CreateUserView from "@/views/UserRegisterView.vue";
import { actionPrefix, modulesSystem, modulesSystemLevel } from "@/constants";
import routeProps from "@/router/props";

export default [
  {
    path: "/users",
    name: "users",
    meta: {
      title: `Usuários`,
      ShowNav: true,
      modulesNeeded: [modulesSystem.user, modulesSystemLevel.read],
    },
    component: BaseCrudView,
    props: routeProps.user,
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
].map((r) => {
  r.meta.navBarTab = 0;

  return r;
});
