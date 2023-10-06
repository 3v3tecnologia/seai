<template>
  <div>
    <div class="text-black-50 d-flex">
      Máximo de {{ itemsPerGraph }} bacias/municípios por gráfico
    </div>
    <div class="row justify-content-center mb-3 mb-lg-5">
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
import ScatterChart from "@/components/charts/ScatterChart.vue";
import PizzaChart from "@/components/charts/PizzaChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import StackedBarChart from "@/components/charts/StackedBarChart.vue";
import { itemsPerGraph } from "@/constants";

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
  const stackKey = "Mes";
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
        title: "Quantidade de recenseados",
        "series-name": "Recenseados",
        "value-key": registeredCount.value.valueKey,
        data: registeredCount.value.data,
      },
      {
        component: StackedBarChart,
        title: "Quantidade de trabalhadores",
        "series-name": "trabalhadores",
        "value-key": workersCount.value.valueKey,
        "stack-key": workersCount.value.stackKey,
        data: workersCount.value.data,
      },
      {
        component: StackedBarChart,
        title: "Captação mensal superficial (volume)",
        "series-name": "Captação superficial (volume)",
        "value-key": captationCountSuper.value.valueKey,
        "stack-key": captationCountSuper.value.stackKey,
        data: captationCountSuper.value.data,
      },
      {
        component: StackedBarChart,
        title: "Captação mensal superficial (vazão)",
        "series-name": "Captação superficial (vazão)",
        "value-key": "Vazão média",
        "stack-key": captationCountSuper.value.stackKey,
        data: captationCountSuper.value.data,
      },
      {
        component: StackedBarChart,
        title: "Captação mensal subterrânea (volume)",
        "series-name": "Captação subterrânea (volume)",
        "value-key": captationCountUnder.value.valueKey,
        "stack-key": captationCountUnder.value.stackKey,
        data: captationCountUnder.value.data,
      },
      {
        component: StackedBarChart,
        title: "Captação mensal subterrânea (vazão)",
        "series-name": "Captação subterrânea (vazão)",
        "value-key": "Vazão média",
        "stack-key": captationCountUnder.value.stackKey,
        data: captationCountUnder.value.data,
      },
    ],
    [
      {
        component:
          props.currentDataFormat.value === 3 ? BarChart : StackedBarChart,
        title: "Animais",
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
        title: "Captação de tanques subterrânea (volume)",
        "series-name": "Captação subterrânea (volume)",
        "value-key": aquacultureUnder.value.valueKey,
        "stack-key": aquacultureUnder.value.stackKey,
        data: aquacultureUnder.value.data,
      },
      {
        component: StackedBarChart,
        title: "Captação de tanques superficial (volume)",
        "series-name": "Captação superficial (volume)",
        "value-key": aquacultureSuper.value.valueKey,
        "stack-key": aquacultureSuper.value.stackKey,
        data: aquacultureSuper.value.data,
      },
      {
        component: BarChart,
        title: "Quantidade de tanques",
        "series-name": "Tanques",
        "value-key": "Tanques",
        data: aquacultureCount.value.data,
      },
    ],
    [
      {
        component: BarChart,
        title: "Segurança econômica",
        "series-name": "Rentabilidade por área",
        "value-key": securityEconomic.value.valueKey,
        data: securityEconomic.value.data,
      },
      {
        component: BarChart,
        title: "Segurança social",
        "series-name": "Empregos por área",
        "value-key": securitySocial.value.valueKey,
        data: securitySocial.value.data,
      },
      {
        component: BarChart,
        title: "Segurança hídrica",
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
