<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <div class="d-flex flex-column flex-lg-row align-items-center">
        <div class="pt-3 pb-2"></div>

        <BaseDropdown
          v-model="groupReports"
          :options="groupReportsOptions"
          placeholder="Tipo de relatório"
          width="200px"
        />

        <div class="px-4"></div>

        <BaseDropdown
          v-model="showingDataFormat"
          :options="showingDataOptions"
          placeholder="Agrupamento"
          :disabled="isLoadingReport"
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
          inline-labe
          remove-margin
          v-model="city"
          :disabled="showingDataFormat.value === 1"
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

      <div v-if="!isLoadingReport" class="mt-4 mt-lg-5">
        <ChartReports
          v-if="showingTab === 'charts'"
          :data="reportsData"
          :current-report="groupReports"
          :current-data-format="showingDataFormat"
        />
        <ExportData
          v-else
          :show-cities="showCities"
          :show-consuming="showConsuming"
          :show-basin="showBasin"
          :data="reportsData"
          :current-report="groupReports"
          :current-data-format="showingDataFormat"
        />
      </div>
    </BasicContentWrapper>
  </div>
</template>

<script setup>
import ChartReports from "@/components/charts/ChartReports.vue";
import ExportData from "@/components/charts/ExportData.vue";
import BaseSwitch from "@/components/BaseSwitch.vue";
import BaseDropdown from "@/components/BaseDropdown.vue";
import BaseCheckBox from "@/components/BaseCheckBox.vue";
import BasicContentWrapper from "@/components/BasicContentWrapper.vue";
import { computed, ref, defineProps, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const totalGroupment = [
  {
    title: "Bacia hidrográfica",
    value: 1,
  },
  {
    title: "Município",
    value: 2,
  },
  {
    title: "Tipo de criação",
    value: 3,
  },
];

const showingDataFormat = ref(totalGroupment[0]);

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

const showingDataOptions = computed(() =>
  totalGroupment.filter((opt) =>
    groupReports.value.value === 2 ? true : opt.value != 3
  )
);

const showConsuming = computed(() => showingDataFormat.value.value === 3);
const showBasin = computed(() => showingDataFormat.value.value === 1);
const showCities = computed(() => showingDataFormat.value.value === 2);

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

const hydrographicBasinName = computed(() =>
  hydrographicBasin.value.map((d) => d["title"])
);

const citiesName = computed(() => city.value.map((d) => d["title"]));

const reportsData = computed(() => {
  const reportsDataRaw = store.state.reportsData;
  const filteredData = {};

  if (!hydrographicBasinName.value.length && !citiesName.value.length) {
    return reportsDataRaw;
  }

  Object.keys(reportsDataRaw).forEach(
    (key) =>
      (filteredData[key] = reportsDataRaw[key].filter((d) => {
        const includesBasin = hydrographicBasinName.value.includes(d["Bacia"]);
        const includesCity = citiesName.value.includes(d["Municipio"]);

        return includesBasin || includesCity;
      }))
  );

  return filteredData;
});

const hydrographicBasinOptions = computed(
  () => store.state.hydrographicBasinOptions
);

const isLoadingReport = computed(() => store.state.isLoadingReport);

const cityOptions = computed(() => {
  return store.state.cityOptions.filter((val) => {
    if (hydrographicBasin.value.length) {
      return hydrographicBasin.value.find((v) => v.value == val.IdBacia);
    }

    return val;
  });
});

const hydrographicBasin = ref([]);
const city = ref([]);

store.dispatch("FETCH_REPORTS_DATA", filtersRequest.value);

watch(
  () => showingDataFormat,
  async (val) => {
    if (val.value.value === 1) {
      city.value = [];
    }

    await store.dispatch("FETCH_REPORTS_DATA", filtersRequest.value);
  },
  { deep: true }
);

watch(
  () => groupReports,
  async (newVal) => {
    if (newVal.value.value !== 2 && showingDataFormat.value.value === 3) {
      showingDataFormat.value = totalGroupment[0];
    }

    await store.dispatch("FETCH_REPORTS_DATA", filtersRequest.value);
  },
  { deep: true }
);

watch(
  () => hydrographicBasin.value,
  (newVal) => {
    if (newVal.length) {
      const idBasins = newVal.map((d) => d.IdBacia);
      const availableCities = city.value.filter((c) =>
        idBasins.includes(c.IdBacia)
      );

      city.value = availableCities;
    }
  },
  { deep: true }
);
</script>
