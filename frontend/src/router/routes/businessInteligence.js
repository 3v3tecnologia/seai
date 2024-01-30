import ReportsView from "@/views/ReportsView/PageView.vue";

export default [
  {
    path: "/reports",
    name: "reports",
    meta: {
      ShowNav: true,
      navBarTab: 4,
      title: `Relatórios`,
    },
    component: ReportsView,
  },
  {
    path: "/charts",
    name: "charts",
    meta: {
      ShowNav: true,
      navBarTab: 5,
      title: `Gráficos`,
    },
    component: ReportsView,
    props: {
      showingTab: "charts",
    },
  },
];
