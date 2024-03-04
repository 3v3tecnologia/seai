<template>
  <div class="row">
    <div class="col-lg-12 mb-2">
      <BaseTable
        v-for="(report, i) in currentReportTables"
        :selectable="false"
        :key="report.title"
        :class="i ? 'mt-4' : ''"
        :data="report.data"
        :title="report.title"
        :columns="report.columns"
        is-report
      />
    </div>
  </div>
</template>

<script setup>
import BaseTable from "@/components/tables/BaseTable.vue";
import { toast } from "vue3-toastify";
import { ref, defineProps, computed } from "vue";

const table = ref(null);
const tabulator = ref(null);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  currentDataFormat: {
    type: Object,
    default: () => ({}),
  },
  currentReport: {
    type: Object,
    default: () => ({}),
  },
  showCities: {
    type: Boolean,
    default: false,
  },
  showBasin: {
    type: Boolean,
    default: false,
  },
  showConsuming: {
    type: Boolean,
    default: false,
  },
});

const cultureColumn = {
  title: "Cultura",
  field: "Cultura",
};

const basicColumns = computed(() => [
  {
    title: "Bacia",
    field: "Bacia",
    visible: props.showBasin || props.showCities,
  },
  {
    title: "Municipio",
    field: "Municipio",
    visible: props.showCities,
  },
]);

const aquaReports = computed(() => [
  {
    title: "Quantidade de tanques",
    columns: [
      ...basicColumns.value,
      {
        title: "Tanques",
        field: "Tanques",
      },
    ],
    data: props.data.aquaculture,
  },
  {
    title: "Captação de tanques",
    columns: [
      ...basicColumns.value,
      {
        title: "Mês",
        field: "Mes",
      },
      {
        title: "Captação",
        field: "Captação",
      },
      {
        title: "Volume por tanque (m³)",
        field: "Volume/tanque",
      },
    ],
    data: props.data.tankCaptation,
  },
]);

const hydricResources = computed(() => [
  {
    title: "Corte hídrico",
    columns: [
      basicColumns.value[0],
      cultureColumn,
      {
        title: "Corte hídrico (m³/ha)",
        field: "CorteHidrico",
      },
    ],
    data: props.data.hydricResources,
  },
]);

const indicatorsBase = computed(() => [
  {
    title: "Segurança econômica",
    columns: [
      {
        title: "Rentabilidade",
        field: "Rentabilidade",
      },
      {
        title: "Rentabilidade por área",
        field: "RentabilidadePorArea",
      },
    ],
    data: props.data.securityEconomic,
  },
  {
    title: "Segurança social",
    columns: [
      {
        title: "Empregos por pessoa física",
        field: "EmpregosPF",
      },
      {
        title: "Empregos por pessoa jurídica",
        field: "EmpregosPJ",
      },
      {
        title: "Empregos por área",
        field: "EmpregosPorArea",
      },
    ],
    data: props.data.securitySocial,
  },
  {
    title: "Segurança hídrica",
    columns: [
      {
        title: "Consumo total",
        field: "ConsumoTotal",
      },
      {
        title: "Volume por área",
        field: "VolumePorArea",
      },
    ],
    data: props.data.securityWater,
  },
]);

const indicators = computed(() =>
  indicatorsBase.value.map((indicator) => {
    return {
      ...indicator,
      columns: [...basicColumns.value, ...indicator.columns],
    };
  })
);

const indicatorsCulture = computed(() => [
  ...indicatorsBase.value.map((indicator) => {
    return {
      ...indicator,
      columns: [basicColumns.value[0], cultureColumn, ...indicator.columns],
    };
  }),

  ...hydricResources.value,
]);

const animals = computed(() => [
  {
    title: "Animais",
    columns: [
      ...basicColumns.value,
      {
        title: "Tipo de criação",
        field: "TipoCriacao",
      },
      {
        title: "Consumo (litros/dia)",
        field: "Consumo",
        visible: !!props.showConsuming,
      },
      {
        title: "Quantidade",
        field: "Quantidade",
        visible: !props.showConsuming,
      },
    ],
    data: props.data.animals,
  },
]);

const generalReports = computed(() => [
  {
    title: "Quantidade de recenseados",
    columns: [
      ...basicColumns.value,
      {
        title: "Recenseados",
        field: "Quantidade",
      },
    ],
    data: props.data.registeredCount,
  },
  {
    title: "Quantidade de trabalhadores",
    columns: [
      ...basicColumns.value,
      {
        title: "Tipo",
        field: "Tipo",
      },
      {
        title: "Trabalhadores",
        field: "Média de trabalhadores",
      },
    ],
    data: props.data.workersCount,
  },
  {
    title: "Captação mensal",
    columns: [
      ...basicColumns.value,
      {
        title: "Captação",
        field: "Captação",
      },
      {
        title: "Mês",
        field: "Mes",
      },
      {
        title: "Vazão média (m³/h)",
        field: "Vazão média",
      },
      {
        title: "Volume médio (m³)",
        field: "Volume médio",
      },
    ],
    data: props.data.captationCount,
  },
]);

const currentReportTables = computed(() => {
  if (props.currentReport.value === 1) {
    return generalReports.value;
  } else if (props.currentReport.value === 2) {
    return animals.value;
  } else if (props.currentReport.value === 3) {
    return aquaReports.value;
  } else if (props.currentReport.value === 4) {
    return indicators.value;
  } else if (props.currentReport.value === 5) {
    return indicatorsCulture.value;
  } else if (props.currentReport.value === 6) {
    return hydricResources.value;
  }

  return [];
});
</script>
