import { columnFullDateFormat } from "@/helpers/dto";
import moment from "moment";

const searchFilter = [];

export default {
  actionText: "leitura",
  getDataKey: "GET_PLUVIOMETER_READS",
  deleteDataKey: "",
  storeDataKey: "readsPluviometer",
  navBarTab: 2,
  hideSearch: true,
  showDateRangeFilter: true,
  hasApiFilters: true,
  stateFilters: [],
  filters: [],
  searchFilter: searchFilter,
  actionRoutes: {
    edit: "pluviometer-reads-edit",
    create: "",
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
      title: "Integridade de dados",
      field: "hasMissingColumn",
      formatter: "tickCross",
    },
    {
      title: "Data de envio",
      field: "FullTime",
      formatter: columnFullDateFormat,
    },
    {
      title: "Precipitação",
      field: "Precipitation",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
  ],
};
