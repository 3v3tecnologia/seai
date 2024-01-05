<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <div
        class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center"
      >
        <div class="d-flex justify-content-between w-100-mob">
          <!-- <div class="pt-3 pb-2"></div> -->
          <BaseDropdown
            v-model="groupReportsTemp"
            :options="groupReportsOptions"
            placeholder="Tipo de relatório"
          />

          <div class="px-2"></div>

          <BaseDropdown
            v-model="showingDataFormatTemp"
            :options="showingDataOptions"
            placeholder="Agrupamento"
          />
        </div>

        <div class="d-flex flex-lg-row flex-column mt-3 mb-4 my-lg-0">
          <div class="px-lg-2"></div>

          <BaseCheckBox
            inline-label
            remove-margin
            v-model="hydrographicBasinTemp"
            :options="hydrographicBasinOptions"
            label="Bacias hidrográficas"
            placeholder="Bacias hidrográficas"
          />

          <div class="mt-3 my-lg-0 px-lg-2" />

          <BaseCheckBox
            inline-labe
            remove-margin
            v-model="cityTemp"
            :disabled="showingDataFormatTemp.value === 1"
            :options="cityOptions"
            label="Municípios"
            placeholder="Municípios"
          />
        </div>

        <div class="d-flex">
          <div class="px-lg-4" />

          <button
            @click="applyFilters"
            :disabled="isLoadingReport"
            class="btn btn-success px-2 py-2"
          >
            Gerar relatório
          </button>
        </div>
      </div>

      <div class="my-5 mb-lg-4">
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
          :showing-data-format="showingDataFormat"
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

const groupReportsTemp = ref({ ...groupReports.value });
const showingDataFormatTemp = ref({ ...showingDataFormat.value });

const showingDataOptions = computed(() =>
  totalGroupment.filter((opt) =>
    groupReportsTemp.value.value === 2 ? true : opt.value != 3
  )
);

const showConsuming = computed(() => showingDataFormat.value.value === 3);
const showBasin = computed(() => showingDataFormat.value.value === 1);
const showCities = computed(() => showingDataFormat.value.value === 2);

store.dispatch("FETCH_PLACES_OPTIONS");

const props = defineProps({
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
    if (hydrographicBasinTemp.value.length) {
      return hydrographicBasinTemp.value.find((v) => v.value == val.IdBacia);
    }

    return val;
  });
});

const hydrographicBasin = ref([]);
const city = ref([]);

const hydrographicBasinTemp = ref([...hydrographicBasin.value]);
const cityTemp = ref([...city.value]);

const applyFilters = () => {
  groupReports.value = groupReportsTemp.value;
  showingDataFormat.value = showingDataFormatTemp.value;
  hydrographicBasin.value = hydrographicBasinTemp.value;
  city.value = cityTemp.value;
};

watch(
  () => showingDataFormat,
  async (val) => {
    if (val.value.value === 1) {
      city.value = [];
      cityTemp.value = city.value;
    }
  },
  { deep: true }
);

watch(
  () => groupReportsTemp,
  async (newVal) => {
    if (newVal.value.value !== 2 && showingDataFormatTemp.value.value === 3) {
      showingDataFormatTemp.value = totalGroupment[0];
    }
  },
  { deep: true }
);

watch(
  () => filtersRequest.value,
  async (newVal) => {
    await store.dispatch("FETCH_REPORTS_DATA", newVal);
  },
  { deep: true, immediate: true }
);

watch(
  () => hydrographicBasinTemp.value,
  (newVal) => {
    if (newVal.length) {
      const idBasins = newVal.map((d) => d.IdBacia);
      const availableCities = cityTemp.value.filter((c) =>
        idBasins.includes(c.IdBacia)
      );

      cityTemp.value = availableCities;
    }
  },
  { deep: true }
);

watch(
  () => props.showingTab,
  async (val) => {
    if (val === "charts") {
      store.commit("SET_CURRENT_TAB", 4);
    } else {
      store.commit("SET_CURRENT_TAB", 3);
    }

    // await store.dispatch("FETCH_REPORTS_DATA", filtersRequest.value);
  },
  { immediate: true }
);
</script>
