<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <div class="d-flex align-items-center justify-content-start">
        <BaseSelect
          inline-label
          remove-margin
          v-model="hydrographicBasin"
          :options="hydrographicBasinOptions"
          label="Bacia hidrográfica"
        />

        <div class="px-4" />

        <BaseSelect
          :disabled="!hydrographicBasin.value"
          inline-label
          remove-margin
          v-model="city"
          :options="cityOptions"
          label="Município"
        />
      </div>

      <div class="mt-4 mt-lg-5">
        <div class="row mb-3 mb-lg-5">
          <div class="col-lg-6 d-flex align-items-center justify-content-start">
            <BarChart
              :width="400"
              :data="anuallyEarn.data"
              title="Rendimento anual (R$)"
              series-name="Rendimento"
              :labels="anuallyEarn.labels"
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
              :data="anuallyProduction.data"
              title="Produção anual (kg)"
              :labels="anuallyProduction.labels"
              tooltip-sufix="kg"
              id="11"
              is-horizontal
              color="#29066B"
            />
          </div>
        </div>

        <div class="row mb-3 mb-lg-5">
          <div
            class="col-lg-5 d-flex align-items-center justify-content-center"
          >
            <BarChart
              series-name="Volume"
              :data="anuallyWaterConsumeBar.data"
              title="Consumo anual de água (m³)"
              :labels="anuallyWaterConsumeBar.labels"
              color="#176BAD"
              id="9"
              tooltip-sufix="m³"
            />
          </div>
          <div
            class="col-lg-4 d-flex align-items-center justify-content-center"
          >
            <BarChart
              series-name="Área"
              :data="anuallyEarn.data"
              title="Área Irrigada total (ha)"
              :labels="anuallyEarn.labels"
              color="#142459"
              id="10"
              tooltip-sufix="ha"
            />
          </div>
          <div class="col-lg-3">
            <ScatterChart
              id="8"
              :data="anuallyWaterCPI.data"
              title="Consumo de água"
              :labels="anuallyWaterCPI.labels"
              :tooltip-sufix="['m³', 'ha']"
            />
          </div>
        </div>

        <div class="row mb-2 mb-lg-4">
          <div
            class="col-lg-4 d-flex align-items-center justify-content-center"
          >
            <ScatterChart
              id="1"
              :data="productiveSecurityKg.data"
              title="Segurança produtiva"
              group="3"
              :labels="productiveSecurityKg.labels"
              :tooltip-sufix="['kg', 'ha']"
            />
          </div>
          <div
            class="col-lg-4 d-flex align-items-center justify-content-center"
          >
            <LineChart
              series-name="Proporção"
              id="2"
              :data="anuallyProduction.data"
              title="Segurança econômica"
              group="1"
              :labels="anuallyProduction.labels"
              tooltip-sufix="R$/ha"
              color="#29066B"
            />
          </div>
          <div
            class="col-lg-4 d-flex align-items-center justify-content-center"
          >
            <LineChart
              series-name="Proporção"
              id="3"
              :data="anuallyProduction.data"
              title="Segurança social"
              group="2"
              :labels="anuallyProduction.labels"
              tooltip-sufix="empregos/ha"
              color="#29066B"
            />
          </div>
        </div>
        <div class="row">
          <div
            class="col-lg-4 d-flex align-items-center justify-content-center"
          >
            <ScatterChart
              series-name="Proporção"
              id="4"
              :data="productiveSecurityEarn.data"
              title="Segurança produtiva"
              :labels="productiveSecurityEarn.labels"
              group="3"
              :tooltip-sufix="['kg', 'm³']"
            />
          </div>
          <div
            class="col-lg-4 d-flex align-items-center justify-content-center"
          >
            <LineChart
              series-name="Proporção"
              id="5"
              :data="anuallyProduction.data"
              title="Segurança econômica"
              :labels="anuallyProduction.labels"
              tooltip-sufix="R$/m³"
              group="1"
              color="#29066B"
            />
          </div>
          <div
            class="col-lg-4 d-flex align-items-center justify-content-center"
          >
            <LineChart
              series-name="Proporção"
              id="6"
              :data="anuallyProduction.data"
              title="Segurança social"
              group="2"
              :labels="anuallyProduction.labels"
              tooltip-sufix="empregos/m³"
              color="#29066B"
            />
          </div>
        </div>
      </div>
    </BasicContentWrapper>
  </div>
</template>

<script lang="ts" setup>
import BaseSelect from "@/components/BaseSelect.vue";
import ScatterChart from "@/components/charts/ScatterChart.vue";
import PizzaChart from "@/components/charts/PizzaChart.vue";
import LineChart from "@/components/charts/LineChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import BasicContentWrapper from "@/components/BasicContentWrapper.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const defaultHydroOption = {
  title: "Todas as bacias",
  value: null,
};
const defaultCityOption = {
  title: "Todas as cidades",
  value: null,
};

const hydrographicBasinOptions = computed(() => [
  defaultHydroOption,
  ...store.state.hydrographicBasinOptions,
]);

const cityOptions = computed(() => [
  defaultCityOption,
  ...store.state.cityOptions,
]);

const hydrographicBasin = ref(hydrographicBasinOptions.value[0]);
const city = ref(cityOptions.value[0]);

const anuallyWaterConsumeBar = {
  data: [297.696, 113.569, 30.96],
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const anuallyEarn = {
  data: [1297696, 1113569, 213096],
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const anuallyWaterIrrigatedBar = {
  data: [15.8, 35.1, 17.0],
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const anuallyProduction = {
  data: [200000, 300000, 450000],
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const anuallyWaterIrrigated = {
  data: [15.8, 35.1, 17.0],
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const productiveSecurityEarn = {
  // data: [29350, 15500, 40603],
  data: anuallyEarn.data.map((val, i) => {
    const area = anuallyWaterIrrigated.data[i];

    if (!area || !val) {
      return 0;
    }

    return [val, area];
  }),
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const productiveSecurityKg = {
  // data: [29350, 15500, 40603],
  data: anuallyProduction.data.map((val, i) => {
    const area = anuallyWaterIrrigated.data[i];

    if (!area || !val) {
      return 0;
    }

    return [val, area];
  }),
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const anuallyWaterConsume = {
  data: [297.696, 113.569, 30.96],
  labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
};

const anuallyWaterCPI = {
  data: anuallyWaterConsume.data.map((consumed, i) => {
    const area = anuallyWaterIrrigated.data[i];

    if (!area || !consumed) {
      return 0;
    }

    return [consumed, area];
  }),
  labels: anuallyWaterConsume.labels,
};
</script>

<style lang="scss" scoped></style>
