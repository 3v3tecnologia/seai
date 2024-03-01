import weightUpdate from "@/router/props/weight/update";
import BaseForm from "@/views/BaseForm.vue";

export default [
  {
    path: "/weight",
    name: "weight",
    meta: {
      ShowNav: true,
      title: "Pesos",
      navBarTab: 9,
    },
    component: BaseForm,
    props: weightUpdate,
  },
];
