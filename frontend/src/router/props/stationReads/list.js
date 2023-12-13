import { columnFullDateFormat } from "@/helpers/dto";
import moment from "moment";

const searchFilter = ["Name", "LocationName"];

export default {
  actionText: "leitura",
  getDataKey: "GET_STATION_READS",
  deleteDataKey: "",
  storeDataKey: "readsStation",
  hasApiFilters: true,
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
  navBarTab: 2,
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
    {
      title: "Temperatura atmosférica média",
      field: "AverageAtmosphericTemperature",
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
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
      title: "ET0",
      field: "ET0",
      validator: ["required", "min:0", "max:5"],
      formatter: (col) => {
        return col._cell.value?.Value
          ? +col._cell.value?.Value.toFixed(2)
          : col._cell.value?.Value;
      },
    },
  ],
};
