import AuthView from "@/views/templates/AuthView.vue";
import RetrieveAccount from "@/views/RetrieveAccount.vue";
import BaseForm from "@/views/BaseForm.vue";
import ChangePasswordView from "@/views/ChangePasswordView.vue";
import InitialRegisterUserInfos from "@/views/InitialRegisterUserInfos.vue";
import routeProps from "@/router/props";

export default [
  {
    path: "/",
    redirect: { path: "/users" },
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: `Login`,
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
    path: "/change-password",
    name: "change-password",
    meta: {
      title: `Trocar senha`,
    },
    component: ChangePasswordView,
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
    path: "/initial-register-infos",
    name: "initial-register-infos",
    meta: {
      title: `Concluir cadastro`,
    },
    component: InitialRegisterUserInfos,
  },
];
