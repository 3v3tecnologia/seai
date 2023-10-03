<template>
  <div>
    <div v-if="currentReport.value === 1" class="row mb-3 mb-lg-5">
      <div class="col-lg-4 d-flex align-items-center justify-content-start">
        <PizzaChart
          :width="400"
          :data="workersCount.data"
          title="Quantidade de trabalhadores"
          series-name="Quantidade"
          :labels="workersCount.labels"
          color="#7D3AC1"
          id="7"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-start">
        <PizzaChart
          :width="400"
          :data="registeredCount.data"
          title="Quantidade de recenseados"
          series-name="Quantidade"
          :labels="registeredCount.labels"
          color="#7D3AC1"
          id="8"
        />
      </div>

      <div class="col-lg-4 d-flex align-items-center justify-content-start">
        <PizzaChart
          :width="400"
          :data="captationCountSuper.data"
          title="Captação mensal superficial"
          series-name="Captação"
          :labels="captationCountSuper.labels"
          color="#7D3AC1"
          id="9"
          has-monthly-filter
        />
      </div>

      <div
        class="col-lg-4 d-flex align-items-center justify-content-start mt-4"
      >
        <PizzaChart
          :width="400"
          :data="captationCountUnder.data"
          title="Captação mensal subterrânea"
          series-name="Captação"
          :labels="captationCountUnder.labels"
          color="#7D3AC1"
          id="10"
          has-monthly-filter
        />
        <!-- </div> -->
      </div>
      <!-- 
      <div class="col-lg-6 d-flex align-items-center justify-content-end">
        <BarChart
          :width="400"
          series-name="Produzido"
          :data="anuallyProduction"
          title="Produção anual (kg)"
          :labels="labels"
          tooltip-sufix="kg"
          id="11"
          is-horizontal
          color="#29066B"
        />
      </div>
    </div>

    <div class="row mb-3 mb-lg-5">
      <div class="col-lg-5 d-flex align-items-center justify-content-center">
        <BarChart
          series-name="Volume"
          :data="anuallyWaterConsumeBar"
          title="Consumo anual de água (m³)"
          :labels="labels"
          color="#176BAD"
          id="9"
          tooltip-sufix="m³"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <BarChart
          series-name="Área"
          :data="anuallyEarn"
          title="Área Irrigada total (ha)"
          :labels="labels"
          color="#142459"
          id="10"
          tooltip-sufix="ha"
        />
      </div>
      <div class="col-lg-3">
        <ScatterChart
          id="8"
          :data="anuallyWaterCPI"
          title="Consumo de água"
          :labels="labels"
          :tooltip-sufix="['m³', 'ha']"
        />
      </div>
    </div>

    <div class="row mb-2 mb-lg-45">
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <ScatterChart
          id="1"
          :data="productiveSecurityKg"
          title="Segurança produtiva"
          group="3"
          :labels="labels"
          :tooltip-sufix="['kg', 'ha']"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="2"
          :data="anuallyProduction"
          title="Segurança econômica"
          group="1"
          :labels="labels"
          tooltip-sufix="R$/ha"
          color="#29066B"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="3"
          :data="anuallyProduction"
          title="Segurança social"
          group="2"
          :labels="labels"
          tooltip-sufix="empregos/ha"
          color="#29066B"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <ScatterChart
          series-name="Proporção"
          id="4"
          :data="productiveSecurityEarn"
          title="Segurança produtiva"
          :labels="labels"
          group="3"
          :tooltip-sufix="['kg', 'm³']"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="5"
          :data="anuallyProduction"
          title="Segurança econômica"
          :labels="labels"
          tooltip-sufix="R$/m³"
          group="1"
          color="#29066B"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="6"
          :data="anuallyProduction"
          title="Segurança social"
          group="2"
          :labels="labels"
          tooltip-sufix="empregos/m³"
          color="#29066B"
        />
      </div> -->
    </div>
    <div v-else-if="currentReport.value === 2" class="row mb-3 mb-lg-5">
      <div class="col-lg-12 d-flex align-items-center justify-content-start">
        <BarChart
          :width="400"
          :data="workersCount.data"
          title="Animais"
          series-name="Quantidade"
          :labels="workersCount.labels"
          color="#7D3AC1"
          id="7"
        />
      </div>
      <!-- 
      <div class="col-lg-6 d-flex align-items-center justify-content-end">
        <BarChart
          :width="400"
          series-name="Produzido"
          :data="anuallyProduction"
          title="Produção anual (kg)"
          :labels="labels"
          tooltip-sufix="kg"
          id="11"
          is-horizontal
          color="#29066B"
        />
      </div>
    </div>

    <div class="row mb-3 mb-lg-5">
      <div class="col-lg-5 d-flex align-items-center justify-content-center">
        <BarChart
          series-name="Volume"
          :data="anuallyWaterConsumeBar"
          title="Consumo anual de água (m³)"
          :labels="labels"
          color="#176BAD"
          id="9"
          tooltip-sufix="m³"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <BarChart
          series-name="Área"
          :data="anuallyEarn"
          title="Área Irrigada total (ha)"
          :labels="labels"
          color="#142459"
          id="10"
          tooltip-sufix="ha"
        />
      </div>
      <div class="col-lg-3">
        <ScatterChart
          id="8"
          :data="anuallyWaterCPI"
          title="Consumo de água"
          :labels="labels"
          :tooltip-sufix="['m³', 'ha']"
        />
      </div>
    </div>

    <div class="row mb-2 mb-lg-45">
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <ScatterChart
          id="1"
          :data="productiveSecurityKg"
          title="Segurança produtiva"
          group="3"
          :labels="labels"
          :tooltip-sufix="['kg', 'ha']"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="2"
          :data="anuallyProduction"
          title="Segurança econômica"
          group="1"
          :labels="labels"
          tooltip-sufix="R$/ha"
          color="#29066B"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="3"
          :data="anuallyProduction"
          title="Segurança social"
          group="2"
          :labels="labels"
          tooltip-sufix="empregos/ha"
          color="#29066B"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <ScatterChart
          series-name="Proporção"
          id="4"
          :data="productiveSecurityEarn"
          title="Segurança produtiva"
          :labels="labels"
          group="3"
          :tooltip-sufix="['kg', 'm³']"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="5"
          :data="anuallyProduction"
          title="Segurança econômica"
          :labels="labels"
          tooltip-sufix="R$/m³"
          group="1"
          color="#29066B"
        />
      </div>
      <div class="col-lg-4 d-flex align-items-center justify-content-center">
        <LineChart
          series-name="Proporção"
          id="6"
          :data="anuallyProduction"
          title="Segurança social"
          group="2"
          :labels="labels"
          tooltip-sufix="empregos/m³"
          color="#29066B"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import ScatterChart from "@/components/charts/ScatterChart.vue";
import PizzaChart from "@/components/charts/PizzaChart.vue";
import BarChart from "@/components/charts/BarChart.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  currentReport: {
    type: Object,
    default: () => ({}),
  },
});

const workersCount = computed(() => ({
  data: props.data.workersCount.map((w) => w["Média de trabalhadores"]),
  labels: props.data.workersCount.map(
    (w) => `${w["Bacia"] || w["Municipio"]} - ${w["Tipo"]}`
  ),
}));

const captationCountUnderFiltered = computed(() =>
  props.data.captationCount.filter((c) => c["Captação"] === "Subterrânea")
);

const captationCountUnder = computed(() => ({
  data: captationCountUnderFiltered.value.map((w) => w["Volume médio"]),
  labels: captationCountUnderFiltered.value.map(
    (w) => `${w["Bacia"] || w["Municipio"]} - ${w["Mes"]}`
  ),
}));

const captationCountSuperFiltered = computed(() =>
  props.data.captationCount.filter((c) => c["Captação"] === "Superficial")
);

const captationCountSuper = computed(() => ({
  data: captationCountSuperFiltered.value.map((w) => w["Volume médio"]),
  labels: captationCountSuperFiltered.value.map(
    (w) => `${w["Bacia"] || w["Municipio"]} - ${w["Mes"]}`
  ),
}));

const registeredCount = computed(() => ({
  data: props.data.registeredCount.map((w) => w["Quantidade"]),
  labels: props.data.registeredCount.map((w) => w["Bacia"] || w["Municipio"]),
}));
</script>
