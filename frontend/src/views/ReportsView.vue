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

      <div v-if="!isLoading" class="mt-4 mt-lg-5">
        <ChartReports
          v-if="showingTab === 'charts'"
          :data="reportsData"
          :current-report="groupReports"
        />
        <ExportData
          :show-cities="showingDataFormat.value === 2"
          v-else
          :data="reportsData"
          :current-report="groupReports"
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

const isLoading = ref(true);
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

const hydrographicBasinName = computed(() =>
  hydrographicBasin.value.map((d) => d["title"])
);

const reportsData = computed(() => {
  const reportsDataRaw = store.state.reportsData;
  const filteredData = {};

  if (!hydrographicBasinName.value.length) {
    return reportsDataRaw;
  }

  Object.keys(reportsDataRaw).forEach(
    (key) =>
      (filteredData[key] = reportsDataRaw[key].filter((d) => {
        const data = hydrographicBasinName.value.includes(d["Bacia"]);

        return data;
      }))
  );

  return filteredData;
});

const hydrographicBasinOptions = computed(
  () => store.state.hydrographicBasinOptions
);

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

store
  .dispatch("FETCH_REPORTS_DATA", filtersRequest.value)
  .finally(() => (isLoading.value = false));

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
</script>
