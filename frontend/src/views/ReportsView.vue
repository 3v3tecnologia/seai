<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <div class="d-flex flex-column flex-lg-row align-items-center">
        <div class="pt-3 pb-2"></div>

        <BaseDropdown
          v-model="showingDataFormat"
          :options="showingDataOptions"
          placeholder="Agrupamento"
        />

        <div class="px-4"></div>

        <BaseDropdown
          v-model="groupReports"
          :options="groupReportsOptions"
          placeholder="Tipo de relatório"
          width="200px"
        />

        <div class="pr-md-5"></div>

        <BaseCheckBox
          inline-label
          remove-margin
          v-model="hydrographicBasin"
          :options="hydrographicBasinOptions"
          label="Bacias hidrográficas"
          placeholder="Bacias hidrográficas"
        />

        <div class="px-4 py-3" />

        <BaseCheckBox
          inline-label
          remove-margin
          v-model="city"
          :options="cityOptions"
          label="Municípios"
          placeholder="Municípios"
        />
      </div>

      <div class="mt-5 mb-2">
        <router-link :to="showingTab === 'charts' ? 'reports' : 'charts'">
          {{
            showingTab === "charts"
              ? "Acessar exportação de dados"
              : "Visualizar gráficos"
          }}
        </router-link>
      </div>

      <div class="mt-4 mt-lg-5">
        <ChartReports
          v-if="showingTab === 'charts'"
          :data="reportsData"
          :current-report="groupReports"
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
import BaseDropdown from "@/components/BaseDropdown.vue";
import BaseCheckBox from "@/components/BaseCheckBox.vue";
import BasicContentWrapper from "@/components/BasicContentWrapper.vue";
import { computed, ref, defineProps, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const showingDataOptions = [
  {
    title: "Bacia Hidrográfica",
    value: 1,
  },
  {
    title: "Cidade",
    value: 2,
  },
];
const showingDataFormat = ref(showingDataOptions[0]);

const groupReportsOptions = [
  {
    title: "Geral",
    value: 1,
  },
  {
    title: "Animais",
    value: 2,
  },
  {
    title: "Aquiculturas",
    value: 3,
  },
  {
    title: "Indicadores",
    value: 4,
  },
];
const groupReports = ref(groupReportsOptions[0]);

store.dispatch("FETCH_PLACES_OPTIONS");

defineProps({
  showingTab: {
    type: String,
  },
});

const filtersRequest = computed(() => ({
  showingDataFormat: { ...showingDataFormat.value },
  groupReports: { ...groupReports.value },
}));

watch(
  () => filtersRequest.value,
  async (val) => {
    await store.dispatch("FETCH_REPORTS_DATA", val);
  },
  { deep: true, immediate: true }
);

const reportsData = computed(() => store.state.reportsData);

const hydrographicBasinOptions = computed(
  () => store.state.hydrographicBasinOptions
);

const cityOptions = computed(() =>
  store.state.cityOptions.filter((val) => {
    if (hydrographicBasin.value.length) {
      return hydrographicBasin.value.find(
        (v: { value: number }) => v.value == val.IdBacia
      );
    }

    return val;
  })
);

const hydrographicBasin = ref([]);
const city = ref([]);

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
