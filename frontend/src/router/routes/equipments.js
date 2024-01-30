import BaseForm from "@/views/BaseForm.vue";
import BaseCrudView from "@/views/templates/BaseCrudView.vue";
import { actionPrefix } from "@/constants";
import routeProps from "@/router/props";

export default [
  {
    path: "/equipments",
    name: "equipments",
    meta: {
      ShowNav: true,
      title: `Equipamentos e leituras`,
    },
    component: BaseCrudView,
    props: routeProps.equipments.list,
  },
  {
    path: "/equipments/edit/:id",
    name: "edit-equipment",
    meta: {
      title: `${actionPrefix.edit} equipamento`,
    },
    component: BaseForm,
    props: routeProps.equipments.update,
  },
  {
    path: "/equipments/create",
    name: "create-equipment",
    meta: {
      title: `${actionPrefix.create} equipamento`,
    },
    component: BaseForm,
    props: routeProps.equipments.create,
  },
  {
    path: "/station-reads/:id",
    name: "station-reads",
    meta: {
      title: `Leituras de estação`,
    },
    component: BaseCrudView,
    props: routeProps.reads.station.list,
  },
  {
    path: "/station-reads-edit/:id",
    name: "station-reads-edit",
    meta: {
      title: `${actionPrefix.edit} leituras de estação`,
    },
    component: BaseForm,
    props: routeProps.reads.station.update,
  },
  {
    path: "/pluviometer-reads/:id",
    name: "pluviometer-reads",
    meta: {
      title: `Leituras de pluviômetro`,
    },
    component: BaseCrudView,
    props: routeProps.reads.pluviometer.list,
  },
  {
    path: "/pluviometer-reads/edit/:id",
    name: "pluviometer-reads-edit",
    meta: {
      title: `${actionPrefix.edit} leituras de pluviômetros`,
    },
    component: BaseForm,
    props: routeProps.reads.pluviometer.update,
  },
].map((r) => {
  r.meta.navBarTab = 2;

  return r;
});
