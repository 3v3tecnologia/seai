<template>
  <div>
    <div class="text-black-50 d-flex">
      Máximo de {{ itemsPerGraph }} bacias/municípios por gráfico
    </div>
    <div class="row mb-3 mb-lg-5">
      <div
        v-if="!isLoadingReport && !hasDataToShow"
        class="col-lg-12 mt-4 h4 font-weight-bold"
      >
        Sem dados para as localizações selecionadas
      </div>

      <div
        v-for="chart in chartsGroups[currentReportLoaded - 1]"
        :key="chart.id"
        class="col-lg-6 d-flex align-items-center justify-content-start mt-4"
      >
        <component
          v-if="chart.data && chart.data.length"
          :is="chart.component"
          v-bind="chart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, watch } from "vue";
import BarChart from "@/components/charts/BarChart.vue";
import StackedBarChart from "@/components/charts/StackedBarChart.vue";
import { itemsPerGraph } from "@/constants";
import { reportsBaseConfigs } from "../configs";
import { useStore } from "vuex";

const store = useStore();

const isLoadingReport = computed(() => store.state.report.isLoadingReport);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  showingDataFormat: {
    type: Object,
    default: () => ({}),
  },
  currentReport: {
    type: Object,
    default: () => ({}),
  },
  currentDataFormat: {
    type: Object,
    default: () => ({}),
  },
});

const currentReportLoaded = ref(props.currentReport.value);

const registeredCount = computed(() => {
  const valueKey = "Quantidade";
  const data = props.data.registeredCount;

  return {
    data,
    valueKey,
  };
});

const hasDataToShow = computed(() => {
  return !!Object.values(props.data).find((c) => c.length);
});

const workersCount = computed(() => {
  const stackKey = "Tipo";
  const valueKey = "Média de trabalhadores";

  return {
    data: props.data.workersCount,
    labels: Object.keys(props.data.workersCount),
    stackKey,
    valueKey,
  };
});

const captationCountUnder = computed(() => {
  const stackKey = currentValueKeyLocation.value;
  const valueKey = "Volume médio";
  const data = props.data.captationCount.filter(
    (c) => c["Captação"] === "Subterrânea"
  );

  return {
    data,
    stackKey,
    valueKey,
  };
});

const captationCountSuper = computed(() => {
  const stackKey = currentValueKeyLocation.value;
  const valueKey = "Volume médio";
  const data = props.data.captationCount.filter(
    (c) => c["Captação"] === "Superficial"
  );

  return {
    data,
    stackKey,
    valueKey,
  };
});

const animals = computed(() => {
  const stackKey = "TipoCriacao";
  const valueKey = "Quantidade";
  const data = props.data.animals;

  return {
    data,
    stackKey,
    valueKey,
  };
});

const currentValueKeyLocation = computed(() =>
  props.showingDataFormat.value === 2 ? "Municipio" : "Bacia"
);

const aquacultureCount = computed(() => {
  const valueKey = "QuantidadeTanques";
  const data = props.data.aquaculture;

  return {
    data,
    valueKey,
  };
});

const aquacultureuper = computed(() => {
  const stackKey = currentValueKeyLocation.value;
  const valueKey = "Volume/tanque";
  const data = props.data.tankCaptation.filter(
    (c) => c["Captação"] === "Superficial"
  );

  return {
    data,
    valueKey,
    stackKey,
  };
});

const aquacultureUnder = computed(() => {
  const stackKey = currentValueKeyLocation.value;
  const valueKey = "Volume/tanque";
  const data = props.data.tankCaptation.filter(
    (c) => c["Captação"] === "Subterrânea"
  );

  return {
    data,
    valueKey,
    stackKey,
  };
});

const securityEconomic = computed(() => {
  const valueKey = "RentabilidadePorArea";
  const data = props.data.securityEconomic;

  return {
    data,
    valueKey,
  };
});

const securitySocial = computed(() => {
  const valueKey = "EmpregosPorArea";
  const data = props.data.securitySocial;

  return {
    data,
    valueKey,
  };
});

const securityWater = computed(() => {
  const valueKey = "VolumePorArea";
  const data = props.data.securityWater;

  return {
    data,
    valueKey,
  };
});

const secProd = computed(() => {
  const valueKey = "PesoPorArea";
  const data = props.data.securityProductive;

  return {
    data,
    valueKey,
  };
});

const chartsGroups = computed(() => [
  [
    {
      ...reportsBaseConfigs.registereds,
      data: registeredCount.value.data,
    },
    {
      ...reportsBaseConfigs.workers,
      data: workersCount.value.data,
    },
    {
      ...reportsBaseConfigs.superMonthVol,
      stackKey: currentValueKeyLocation.value,
      data: captationCountSuper.value.data,
    },
    {
      ...reportsBaseConfigs.superMonthFlow,
      stackKey: currentValueKeyLocation.value,
      data: captationCountSuper.value.data,
    },
    {
      ...reportsBaseConfigs.underMonthVol,
      stackKey: currentValueKeyLocation.value,
      data: captationCountUnder.value.data,
    },
    {
      ...reportsBaseConfigs.underMonthFlow,
      stackKey: currentValueKeyLocation.value,
      data: captationCountUnder.value.data,
    },
  ],
  [
    {
      ...(props.currentDataFormat.value === 3
        ? reportsBaseConfigs.animalsByType
        : reportsBaseConfigs.animals),
      data: animals.value.data,
    },
  ],
  [
    {
      ...reportsBaseConfigs.underVolTanks,
      stackKey: currentValueKeyLocation.value,
      data: aquacultureUnder.value.data,
    },
    {
      ...reportsBaseConfigs.tanks,
      data: aquacultureCount.value.data,
    },
    {
      ...reportsBaseConfigs.underFlowTanks,
      stackKey: currentValueKeyLocation.value,
      data: aquacultureuper.value.data,
    },
  ],
  [
    {
      ...reportsBaseConfigs.secEconomic,
      data: securityEconomic.value.data,
    },
    {
      ...reportsBaseConfigs.secSocial,
      data: securitySocial.value.data,
    },
    {
      ...reportsBaseConfigs.secHydro,
      data: securityWater.value.data,
    },
  ],
  [
    {
      ...reportsBaseConfigs.secCultureEconomic,
      data: securityEconomic.value.data,
    },
    {
      ...reportsBaseConfigs.secCultureSocial,
      data: securitySocial.value.data,
    },
    {
      ...reportsBaseConfigs.secCultureHydro,
      data: securityWater.value.data,
    },
    {
      ...reportsBaseConfigs.secCultureProd,
      data: secProd.value.data,
    },
  ],
  [
    {
      ...reportsBaseConfigs.hydricResources,
      data: props.data.hydricResources,
    },
  ],
]);

watch(
  () => isLoadingReport.value,
  (newval) => {
    if (!newval && props.currentReport.value != currentReportLoaded.value) {
      currentReportLoaded.value = props.currentReport.value;
    }
  }
);
</script>
