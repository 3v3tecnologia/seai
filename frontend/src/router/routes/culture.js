import ManagementRegister from "../../views/templates/ManagementRegister.vue";
import cultureList from "@/router/props/culture/list";

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
    props: cultureList,
  },
];
