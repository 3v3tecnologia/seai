import moment from "moment";

const searchFilter = ["Name", "LocationName"];

export default {
  actionText: "leitura",
  getDataKey: "GET_PLUVIOMETER_READS",
  deleteDataKey: "",
  storeDataKey: "readsPluviometer",
  hideSearch: true,
  showDateRangeFilter: true,
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
      title: "Dia",
      field: "Time",
      formatter: (col) => {
        return moment(col._cell.value).format("DD/MM/YYYY");
      },
    },
    {
      title: "Hora",
      field: "Hour",
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
