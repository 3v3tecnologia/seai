import studyUpdate from "@/router/props/study/update";
import BaseForm from "@/views/BaseForm.vue";

export default [
  {
    path: "/study",
    name: "study",
    meta: {
      ShowNav: true,
      title: "Estudos",
      navBarTab: 10,
    },
    component: BaseForm,
    props: studyUpdate,
  },
];
