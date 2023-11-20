import moment from "moment";

const searchFilter = ["Name", "LocationName"];

export default {
  actionText: "leitura",
  getDataKey: "GET_STATION_READS",
  deleteDataKey: "",
  storeDataKey: "readsStation",
  hideSearch: true,
  showDateRangeFilter: true,
  stateFilters: [],
  filters: [],
  searchFilter: searchFilter,
  actionRoutes: {
    edit: "station-reads-edit",
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
      title: "Altitude",
      field: "Altitude",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
    {
      title: "Radiação total",
      field: "TotalRadiation",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
    {
      title: "Umidade relativa média",
      field: "AverageRelativeHumidity",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
    // {
    //   title: "Humidade relativa mínima",
    //   field: "MinRelativeHumidity",
    // formatter: (col) => {
    //   return col._cell.value?.Value ? +col._cell.value?.Value.toFixed(2) : col._cell.value?.Value
    // },
    // },
    // {
    //   title: "Humidade relativa máxima",
    //   field: "MaxRelativeHumidity",
    // formatter: (col) => {
    //   return col._cell.value?.Value ? +col._cell.value?.Value.toFixed(2) : col._cell.value?.Value
    // },
    // },
    {
      title: "Temperatura atmosférica média",
      field: "AverageAtmosphericTemperature",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
    // {
    //   title: "Temperatura atmosférica máxima",
    //   field: "MaxAtmosphericTemperature",
    // formatter: (col) => {
    //   return col._cell.value?.Value ? +col._cell.value?.Value.toFixed(2) : col._cell.value?.Value
    // },
    // },
    // {
    //   title: "Temperatura atmosférica mínima",
    //   field: "MinAtmosphericTemperature",
    // formatter: (col) => {
    //   return col._cell.value?.Value ? +col._cell.value?.Value.toFixed(2) : col._cell.value?.Value
    // },
    // },
    {
      title: "Pressão atmosférica",
      field: "AtmosphericPressure",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
    {
      title: "Velocidade do vento",
      field: "WindVelocity",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
    {
      title: "ETO",
      field: "ETO",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
  ],
};
