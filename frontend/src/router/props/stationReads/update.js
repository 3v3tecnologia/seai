import { inputsFormattersHtml } from "@/constants";

const getDataKey = "GET_CURRENT_STATION_READ";

const submitDataKey = "UPDATE_STATION_READ";

const storeDataKey = "currentStationRead";

const headerLabel = "Editando leitura";

const fields = [
  {
    formKey: "Time",
    component: {
      name: "FilterDate",
      props: {
        label: "Data",
        showTime: true,
        hourFormat: "24",
        selectionMode: "single",
      },
    },
  },
  {
    label: "Altitude",
    formKey: "Altitude",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Radiação total",
    formKey: "TotalRadiation",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Umidade relativa média",
    formKey: "AverageRelativeHumidity",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Temperatura atmosférica média",
    formKey: "AverageAtmosphericTemperature",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Pressão atmosférica",
    formKey: "AtmosphericPressure",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Velocidade do vento",
    formKey: "WindVelocity",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "ETO",
    formKey: "ETO",
    type: "number",
    requireMinMax: false,
    validator: "required",
  },
  {
    label: "Temperatura atmosférica máxima",
    formKey: "MaxAtmosphericTemperature",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Temperatura atmosférica mínima",
    formKey: "MinAtmosphericTemperature",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Humidade relativa mínima",
    formKey: "MinRelativeHumidity",
    type: "number",
    requireMinMax: false,
  },
  {
    label: "Humidade relativa máxima",
    formKey: "MaxRelativeHumidity",
    type: "number",
    requireMinMax: false,
  },
];

const finishedDataButton = {
  text: "Retornar a listagem de equipamentos",
  routeName: "equipments",
};

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton,
  headerLabel,
  fields,
  navBarTab: 2,
};
