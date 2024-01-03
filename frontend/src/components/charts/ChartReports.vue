<template>
  <div>
    <div class="text-black-50 d-flex">
      Máximo de {{ itemsPerGraph }} bacias/municípios por gráfico
    </div>
    <div class="row mb-3 mb-lg-5">
      teste {{ captationCountSuper }}
      <div
        v-if="!isLoadingReport && !hasDataToShow"
        class="col-lg-12 mt-4 h4 font-weight-bold"
      >
        Sem dados para as localizações selecionadas
      </div>
      <div
        v-for="chart in chartsGroups[currentReport.value - 1]"
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
import { defineProps, computed } from "vue";
import BarChart from "@/components/charts/BarChart.vue";
import StackedBarChart from "@/components/charts/StackedBarChart.vue";
import { itemsPerGraph, reportsTitles } from "@/constants";
import { useStore } from "vuex";

const store = useStore();

const isLoadingReport = computed(() => store.state.isLoadingReport);
const props = defineProps({
  data: {
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
  const stackKey = "Mes";
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
  const stackKey = "Bacia";
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

const aquacultureCount = computed(() => {
  const valueKey = "QuantidadeTanques";
  const data = props.data.aquaculture;

  return {
    data,
    valueKey,
  };
});

const aquacultureSuper = computed(() => {
  const stackKey = "Mes";
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
  const stackKey = "Mes";
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

const chartsGroups = computed(() =>
  [
    [
      {
        component: BarChart,
        title: reportsTitles.registereds,
        "series-name": "Recenseados",
        "value-key": registeredCount.value.valueKey,
        data: registeredCount.value.data,
      },
      {
        component: StackedBarChart,
        title: reportsTitles.workers,
        "series-name": "trabalhadores",
        "value-key": workersCount.value.valueKey,
        "stack-key": workersCount.value.stackKey,
        data: workersCount.value.data,
      },
      {
        component: StackedBarChart,
        title: reportsTitles.superMonthVol,
        "series-name": "Volume de captação superficial (m³)",
        "label-by": { type: "month", key: "Mes" },
        "value-key": captationCountSuper.value.valueKey,
        "stack-key": captationCountSuper.value.stackKey,
        data: captationCountSuper.value.data,
      },
      {
        component: StackedBarChart,
        title: reportsTitles.superMonthFlow,
        "series-name": "Vazão média de captação mensal superficial (m³/h)",
        "value-key": "Vazão média",
        "stack-key": captationCountSuper.value.stackKey,
        data: captationCountSuper.value.data,
      },
      {
        component: StackedBarChart,
        title: reportsTitles.underMonthVol,
        "series-name": "Volume de captação mensal subterrânea (m³)",
        "value-key": captationCountUnder.value.valueKey,
        "stack-key": captationCountUnder.value.stackKey,
        data: captationCountUnder.value.data,
      },
      {
        component: StackedBarChart,
        title: reportsTitles.underMonthFlow,
        "value-key": "Vazão média",
        "stack-key": captationCountUnder.value.stackKey,
        data: captationCountUnder.value.data,
      },
    ],
    [
      {
        component:
          props.currentDataFormat.value === 3 ? BarChart : StackedBarChart,
        title: reportsTitles.animals,
        "series-name": "Animais",
        "value-key":
          props.currentDataFormat.value === 3
            ? "Consumo"
            : animals.value.valueKey,
        "stack-key": animals.value.stackKey,
        data: animals.value.data,
        "group-by-key":
          props.currentDataFormat.value === 3 ? "TipoCriacao" : "",
      },
    ],
    [
      {
        component: StackedBarChart,
        title: reportsTitles.underVolTanks,
        "series-name": "Volume de captação de tanques subterrâneos (m³)",
        "value-key": aquacultureUnder.value.valueKey,
        "stack-key": aquacultureUnder.value.stackKey,
        data: aquacultureUnder.value.data,
      },
      {
        component: BarChart,
        title: reportsTitles.tanks,
        "series-name": "Tanques",
        "value-key": "Tanques",
        data: aquacultureCount.value.data,
      },
      {
        component: StackedBarChart,
        title: reportsTitles.underFlowTanks,
        "series-name": "Vazão média de captação de tanques subterrâneos (m³)",
        "value-key": aquacultureSuper.value.valueKey,
        "stack-key": aquacultureSuper.value.stackKey,
        data: aquacultureSuper.value.data,
      },
    ],
    [
      {
        component: BarChart,
        title: reportsTitles.secEconomic,
        "series-name": "Rentabilidade por área",
        "value-key": securityEconomic.value.valueKey,
        data: securityEconomic.value.data,
      },
      {
        component: BarChart,
        title: reportsTitles.secSocial,
        "series-name": "Empregos por área",
        "value-key": securitySocial.value.valueKey,
        data: securitySocial.value.data,
      },
      {
        component: BarChart,
        title: reportsTitles.secHydro,
        "series-name": "Volume por área",
        "value-key": securityWater.value.valueKey,
        data: securityWater.value.data,
      },
    ],
  ].map((sub, i) => {
    sub.map((chart, j) => {
      chart.id = `chart-item-${i}-${j}`;
      chart.width = 400;

      return chart;
    });

    return sub;
  })
);
</script>
