import { columnFullDateFormat } from "@/helpers/dto";
import { route } from "./common";

const stateOptionsFilters = [
  {
    label: "Status",
    field: "status_text_formatted",
    getListKey: "FETCH_STATUS_OPTIONS",
    getterKey: "statusOptions",
  },
];

const searchFilter = ["name", "output"];

export default {
  actionText: "rotina",
  navBarTab: route.navBarTab,
  getDataKey: "GET_STATUS",
  hasApiFilters: true,
  deleteDataKey: "DELETE_STATUS",
  storeDataKey: ["status", "list"],
  filters: [],
  stateFilters: stateOptionsFilters,
  searchFilter: searchFilter,
  actionRoutes: {
    edit: "edit-status",
    create: "create-status",
  },
  headerLabels: [],
  columns: [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      align: "center",
      headerSort: false,
      width: 80,
    },
    {
      title: "Título",
      field: "name",
    },
    {
      title: "Status",
      field: "status_text_formatted",
    },
    {
      title: "Prioridade",
      field: "priority",
    },
    {
      title: "Observação",
      field: "output",
    },
  ],
};
