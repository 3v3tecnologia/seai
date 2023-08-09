<template>
  <div>
    <div class="row mb-3 mb-lg-5">
      <div class="col-lg-6 d-flex align-items-center justify-content-start">
        <BarChart
          :width="400"
          :data="anuallyEarn"
          title="Rendimento anual (R$)"
          series-name="Rendimento"
          :labels="labels"
          color="#7D3AC1"
          is-horizontal
          formatter="money"
          id="7"
        />
      </div>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import BaseCheckBox from "@/components/BaseCheckBox.vue";
import ScatterChart from "@/components/charts/ScatterChart.vue";
import PizzaChart from "@/components/charts/PizzaChart.vue";
import LineChart from "@/components/charts/LineChart.vue";
import BarChart from "@/components/charts/BarChart.vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

computed(() => {
  return {};
});
const labels = computed(() => props.data.map((val) => val.city || val.basin));

const anuallyEarn = computed(() => props.data.map((val) => val.anuallyEarn));

const anuallyProduction = computed(() =>
  props.data.map((val) => val.anuallyProduction)
);

const anuallyWaterConsumeBar = computed(() =>
  props.data.map((val) => val.anuallyWaterConsumeBar)
);

const anuallyWaterCPI = computed(() =>
  props.data.map((val) => [val.anuallyWaterCPI, val.area])
);

const productiveSecurityKg = computed(() =>
  props.data.map((val) => [val.productiveSecurityKg, val.area])
);

const productiveSecurityEarn = computed(() =>
  props.data.map((val) => [val.productiveSecurityEarn, val.area])
);
</script>
