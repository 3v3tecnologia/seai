<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <div class="d-flex flex-column">
        <BaseSwitch v-model="showPerBacin" />

        <BaseSelect
          inline-label
          remove-margin
          v-model="hydrographicBasin"
          :options="hydrographicBasinOptions"
          label="Bacias hidrográficas"
        />

        <BaseCheckboxGroup
          inline-label
          remove-margin
          v-model="hydrographicBasin"
          :options="hydrographicBasinOptions"
          label="Bacias hidrográficas"
        />

        <div class="px-4 py-2" />

        <BaseSelect
          :disabled="!hydrographicBasin.value"
          inline-label
          remove-margin
          v-model="city"
          :options="cityOptions"
          label="Municípios"
        />

        <div class="my-2">
          <router-link :to="showingTab === 'charts' ? 'reports' : 'charts'">
            {{
              showingTab === "charts"
                ? "Acessar exportação de dados"
                : "Visualizar gráficos"
            }}
          </router-link>
        </div>
      </div>

      <div class="mt-4 mt-lg-5">
        <ChartReports
          v-if="showingTab === 'charts'"
          :data="indicatorResponse"
        />
        <ExportData v-else :data="indicatorResponse" />
      </div>
    </BasicContentWrapper>
  </div>
</template>

<script lang="ts" setup>
import ChartReports from "@/components/charts/ChartReports.vue";
import ExportData from "@/components/charts/ExportData.vue";
import BaseSwitch from "@/components/BaseSwitch.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseCheckboxGroup from "@/components/BaseSelect.vue";
import BasicContentWrapper from "@/components/BasicContentWrapper.vue";
import { computed, ref, defineProps, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const showPerBacin = ref(false);

defineProps({
  showingTab: {
    type: String,
  },
});

watch(showPerBacin, (val) => {
  store.dispatch("UPDATE_SHOW_PER_BACIN", val);
});

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

// const anuallyWaterConsumeBar = {
//   data: [297.696, 113.569, 30.96],
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

// const anuallyEarn = {
//   data: [1297696, 1113569, 213096],
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

// const anuallyWaterIrrigatedBar = {
//   data: [15.8, 35.1, 17.0],
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

// const anuallyProduction = {
//   data: [200000, 300000, 450000],
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

// const anuallyWaterIrrigated = {
//   data: [15.8, 35.1, 17.0],
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

// const productiveSecurityEarn = {
//   // data: [29350, 15500, 40603],
//   data: anuallyEarn.data.map((val, i) => {
//     const area = anuallyWaterIrrigated.data[i];

//     if (!area || !val) {
//       return 0;
//     }

//     return [val, area];
//   }),
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

// const productiveSecurityKg = {
//   // data: [29350, 15500, 40603],
//   data: anuallyProduction.data.map((val, i) => {
//     const area = anuallyWaterIrrigated.data[i];

//     if (!area || !val) {
//       return 0;
//     }

//     return [val, area];
//   }),
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

// const anuallyWaterConsume = {
//   data: [297.696, 113.569, 30.96],
//   labels: ["Baixo Jaguaribe", "Alto Jaguaribe", "Médio Jaguaribe"],
// };

const indicatorResponse = [
  {
    basin: "Baixo Jaguaribe",
    city: null,
    anuallyEarn: 1297696,
    anuallyProduction: 200000,
    anuallyWaterConsumeBar: 1235512,
    anuallyWaterCPI: 12355,
    productiveSecurityKg: 23124,
    productiveSecurityEarn: 31233213,
    area: 123123,
  },
  {
    basin: "Médio Jaguaribe",
    city: null,
    anuallyEarn: 31233,
    anuallyProduction: 24213,
    anuallyWaterConsumeBar: 44353,
    anuallyWaterCPI: 232355,
    productiveSecurityKg: 5542,
    productiveSecurityEarn: 1231235,
    area: 93923921,
  },
  {
    basin: "Alto Jaguaribe",
    city: null,
    anuallyEarn: 3123313,
    anuallyProduction: 2313123,
    anuallyWaterConsumeBar: 41233,
    anuallyWaterCPI: 2131123,
    productiveSecurityKg: 412312312,
    productiveSecurityEarn: 512312312,
    area: 3123040,
  },
];
</script>

<style lang="scss" scoped></style>
