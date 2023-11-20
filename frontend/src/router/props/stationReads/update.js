const getDataKey = "GET_CURRENT_STATION_READ";

const submitDataKey = "UPDATE_EQUIPMENT";

const storeDataKey = "currentStationRead";

const headerLabel = "Editando leitura";

const fields = [
  {
    formKey: "Time",
    component: {
      name: "FilterDate",
      props: {
        selectionMode: "single",
        label: "Data",
        showTime: true,
        hourFormat: "24",
      },
    },
  },
  // {
  //   formKey: "Hour",
  //   component: {
  //     name: "FilterDate",
  //     props: {
  //       timeOnly: true,
  //       label: "Hora",
  //     },
  //   },
  // },
  {
    label: "Altitude",
    formKey: "Altitude",
    type: "text",
  },
  {
    label: "Radiação total",
    formKey: "TotalRadiation",
    type: "text",
  },
  {
    label: "Umidade relativa média",
    formKey: "AverageRelativeHumidity",
    type: "text",
  },
  {
    label: "Temperatura atmosférica média",
    formKey: "AverageAtmosphericTemperature",
    type: "text",
  },
  {
    label: "Pressão atmosférica",
    formKey: "AtmosphericPressure",
    type: "text",
  },
  {
    label: "Velocidade do vento",
    formKey: "WindVelocity",
    type: "text",
  },
  {
    label: "ETO",
    formKey: "ETO",
    type: "text",
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
};
