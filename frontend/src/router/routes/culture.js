import ManagementRegister from "../../views/templates/ManagementRegister.vue";

export default [
  {
    path: "/cultures",
    name: "cultures",
    meta: {
      ShowNav: true,
      title: `Culturas`,
      navBarTab: 8,
    },
    component: ManagementRegister,
  },
];
