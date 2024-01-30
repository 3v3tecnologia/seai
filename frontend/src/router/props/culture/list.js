import { columnFullDateFormat } from "@/helpers/dto";
import { route } from "./common";

const searchFilter = ["name"];

const stateOptionsFilters = [
  {
    label: "Recorrência",
    field: "cron_text_formatted",
    getListKey: "FETCH_CRON_OPTIONS",
    getterKey: "cronOptions",
  },
];

export default {
  actionText: "rotina",
  getDataKey: "GET_CRONS",
  hasApiFilters: true,
  deleteDataKey: "DELETE_CRONS",
  storeDataKey: ["cron", "list"],
  filters: [],
  searchFilter: searchFilter,
  stateFilters: stateOptionsFilters,
  actionRoutes: {
    edit: "edit-cron",
    create: "create-cron",
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
      title: "Recorrência",
      field: "cron_text_formatted",
    },
    {
      title: "Prioridade",
      field: "priority",
    },
  ],
};
