import BarChart from "@/components/charts/BarChart.vue";
import StackedBarChart from "@/components/charts/StackedBarChart.vue";

const labelBy = {
  month: { type: "month", key: "Mes" },
  creation: { type: "value", key: "TipoCriacao" },
};

// TODO
// IMPLEMENT GETDATAFUNC TO IN THE CHARTREPORTS CALL THAT FUNC AND GET DATA DINAMICALLY;

export const reportsBaseConfigs = {
  registereds: {
    component: BarChart,
    title: "Recenseados (quantidade)",
    "series-name": "Recenseados",
    "value-key": "Quantidade",
    getDataFunc: (data) => [],
  },
  workers: {
    component: StackedBarChart,
    title: "Trabalhadores (quantidade)",
    "series-name": "Trabalhadores",
    "value-key": "Média de trabalhadores",
    getDataFunc: (data) => [],
    "stack-key": "Tipo",
  },
  tanks: {
    component: BarChart,
    title: "Tanques (quantidade)",
    "series-name": "Tanques",
    "value-key": "Tanques",
    getDataFunc: (data) => [],
  },
  animals: {
    component: StackedBarChart,
    title: "Animais (quantidade)",
    "series-name": "Animais",
  },
  animalsByType: {
    component: BarChart,
    title: "Animais (quantidade)",
    "series-name": "Animais",
    "label-by": labelBy.creation,
    "value-key": "Consumo",
    getDataFunc: (data) => [],
  },
  underVolTanks: {
    component: StackedBarChart,
    title: "Volume de captação de tanques subterrâneos (m³)",
    "series-name": "Volume",
    "value-key": "Volume/tanque",
    getDataFunc: (data) => [],
    "label-by": labelBy.month,
  },
  underFlowTanks: {
    component: StackedBarChart,
    title: "Vazão média de captação de tanques subterrâneos (m³)",
    "series-name": "Vazão média",
    "value-key": "Volume/tanque",
    getDataFunc: (data) => [],
    "label-by": labelBy.month,
  },
  superMonthVol: {
    component: StackedBarChart,
    title: "Volume de captação mensal superficial (m³)",
    "series-name": "Volume",
    "value-key": "Volume médio",
    getDataFunc: (data) => [],
    "label-by": labelBy.month,
  },
  underMonthVol: {
    component: StackedBarChart,
    title: "Volume de captação mensal subterrânea (m³)",
    "series-name": "Volume",
    "value-key": "Volume médio",
    getDataFunc: (data) => [],
    "label-by": labelBy.month,
  },
  underMonthFlow: {
    component: StackedBarChart,
    title: "Vazão média de captação mensal subterrânea (m³/h)",
    "series-name": "Vazão média",
    "value-key": "Vazão média",
    getDataFunc: (data) => [],
    "label-by": labelBy.month,
  },
  superMonthFlow: {
    component: StackedBarChart,
    title: "Vazão média de captação mensal superficial (m³/h)",
    "series-name": "Vazão média",
    "label-by": labelBy.month,
    "value-key": "Vazão média",
    getDataFunc: (data) => [],
  },
  secEconomic: {
    component: BarChart,
    title: "Segurança econômica (R$/ha)",
    "series-name": "Rentabilidade por área",
    "value-key": "RentabilidadePorArea",
    getDataFunc: (data) => [],
    groupByKey: "valor",
  },
  secSocial: {
    component: BarChart,
    title: "Segurança social (Emprego/ha)",
    "series-name": "Empregos por área",
    "value-key": "EmpregosPorArea",
    getDataFunc: (data) => [],
  },
  secHydro: {
    component: BarChart,
    title: "Segurança hídrica (m³/ha)",
    "series-name": "Volume por área",
    "value-key": "VolumePorArea",
    getDataFunc: (data) => [],
  },
  cutHydro: {
    component: BarChart,
    title: "Corte hídrico (m³/ha)",
    "series-name": "Volume por área",
    "value-key": "VolumePorArea",
    getDataFunc: (data) => [],
  },
};
