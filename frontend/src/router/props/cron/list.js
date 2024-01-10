import { columnFullDateFormat } from "@/helpers/dto";
import { route } from "./common";

const searchFilter = ["name"];

export default {
  actionText: "rotina",
  navBarTab: route.navBarTab,
  getDataKey: "GET_CRONS",
  hasApiFilters: true,
  deleteDataKey: "DELETE_CRONS",
  storeDataKey: ["cron", "list"],
  filters: [],
  searchFilter: searchFilter,
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
    {
      title: "Atualizado",
      field: "updated_on",
      formatter: columnFullDateFormat,
    },
  ],
};
