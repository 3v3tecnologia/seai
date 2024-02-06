import ManagementRegister from "../../views/templates/ManagementRegister.vue";

export default [
  {
    path: "/culture",
    name: "culture",
    meta: {
      ShowNav: true,
      title: `Culturas`,
      navBarTab: 8,
    },
    component: ManagementRegister,
  },
  {
    path: "/soil",
    name: "soil",
    meta: {
      ShowNav: true,
      title: `Solos`,
      navBarTab: 8,
    },
    component: ManagementRegister,
  },
];
