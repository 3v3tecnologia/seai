<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <FiltersData
        v-model="filtersData"
        :filters-dropdown="filtersDropdown"
        :filters-checkbox="filtersCheckbox"
      />

      <div class="my-5 mb-lg-4">
        <SubRouting :routes="currentRouteAccess" />
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
import ChartReports from "./components/ChartReports.vue";
import ExportData from "./components/ExportData.vue";
import SubRouting from "@/components/navigation/SubRouting.vue";
import FiltersData from "@/components/form/FiltersData.vue";
import BasicContentWrapper from "@/components/spacing/BasicContentWrapper.vue";
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
  {
    title: "Recursos hídricos",
    value: 5,
  },
];

const filtersData = ref({});

const groupReports = ref(groupReportsOptions[0]);

const groupReportsTemp = ref({ ...groupReports.value });
const showingDataFormatTemp = ref({ ...showingDataFormat.value });

const showingDataOptions = computed(() =>
  totalGroupment.filter((opt) => {
    if (groupReportsTemp.value.value === 2) {
      return true;
    } else if (groupReportsTemp.value.value === 5) {
      return opt.value < 2;
    } else {
      return opt.value != 3;
    }
  })
);

const showConsuming = computed(() => showingDataFormat.value.value === 3);
const showBasin = computed(() => showingDataFormat.value.value === 1);
const showCities = computed(() => showingDataFormat.value.value === 2);

const currentRouteAccess = computed(() => {
  return [
    {
      label: "Exportação de dados",
      name: "reports",
    },
    {
      label: "Visualização de gráficos",
      name: "charts",
    },
  ];
});

const disabledCities = computed(() => {
  const checkDisabled = (dataFormat) => {
    const isBasin = dataFormat.value.value === 1;
    const isEspecialAgrouped = dataFormat.value.value === 3;

    return isBasin || isEspecialAgrouped;
  };

  return {
    temp: checkDisabled(showingDataFormatTemp),
    loaded: checkDisabled(showingDataFormat),
  };
});

const disabledBasins = computed(() => {
  const checkDisabled = (dataFormat) => {
    const isTypeAgrouped = dataFormat.value.value === 3;

    return isTypeAgrouped;
  };

  return {
    temp: checkDisabled(showingDataFormatTemp),
    loaded: checkDisabled(showingDataFormat),
  };
});

store.dispatch("FETCH_PLACES_OPTIONS");

const props = defineProps({
  showingTab: {
    type: String,
  },
});

const filtersRequest = computed(() => ({
  showingDataFormat: { ...showingDataFormat.value },
  groupReports: { ...groupReports.value },
  hydrographicBasin: { ...hydrographicBasin.value },
  city: { ...city.value },
}));

const filtersRequestTemp = computed(() => ({
  showingDataFormat: { ...showingDataFormatTemp.value },
  groupReports: { ...groupReportsTemp.value },
  hydrographicBasin: { ...hydrographicBasinTemp.value },
}));

const hydrographicBasinName = computed(() =>
  hydrographicBasin.value.map((d) => d["title"])
);

const concatValuesFilters = (filter) =>
  Object.values(filter)
    .map(
      (v) =>
        v.value ||
        Object.values(v)
          .map((c) => c.value)
          .join("")
    )
    .join("");

const hasChanges = computed(() => {
  const conactenedFiltersTemp = concatValuesFilters({
    ...filtersRequestTemp.value,
    city: { ...cityTemp.value },
  });
  const conactenedFilters = concatValuesFilters({
    ...filtersRequest.value,
    city: { ...city.value },
  });

  return conactenedFilters != conactenedFiltersTemp;
});

const citiesName = computed(() => city.value.map((d) => d["title"]));

const reportsData = computed(() => {
  const reportsDataRaw = store.state.report.reportsData;
  const filteredData = {};

  if (!hydrographicBasinName.value.length && !citiesName.value.length) {
    return reportsDataRaw;
  }

  Object.keys(reportsDataRaw).forEach(
    (key) =>
      (filteredData[key] = reportsDataRaw[key]
        .filter((d) => {
          if (hydrographicBasinName.value?.length) {
            return hydrographicBasinName.value.includes(d["Bacia"]);
          }

          return true;
        })
        .filter((d) => {
          if (citiesName.value?.length) {
            return citiesName.value.includes(d["Municipio"]);
          }

          return true;
        }))
  );

  return filteredData;
});

const hydrographicBasinOptions = computed(
  () => store.state.report.hydrographicBasinOptions
);

const filtersDropdown = [
  {
    label: "Tipo de relatório",
    options: groupReportsOptions,
    key: "groupReportsTemp",
  },
  {
    label: "Agrupamento",
    options: showingDataOptions.value,
    key: "showingDataFormatTemp",
  },
];

const filtersCheckbox = computed(() => [
  {
    label: "Bacias hidrográficas",
    options: hydrographicBasinOptions.value,
    key: "hydrographicBasinTemp",
    disabled: disabledBasins.value.temp,
  },
  {
    label: "Municípios",
    options: cityOptions.value,
    key: "cityTemp",
    disabled: disabledCities.value.temp,
  },
]);

const isLoadingReport = computed(() => store.state.report.isLoadingReport);

const disabledGenerateReport = computed(
  () => isLoadingReport.value || !hasChanges.value
);

const cityOptions = computed(() => {
  return store.state.report.cityOptions.filter((val) => {
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

  store.commit("SET_CURRENT_BASIN_NAME", hydrographicBasin.value);
};

applyFilters();

watch(
  () => showingDataFormat,
  async (val) => {
    if (disabledCities.value.loaded) {
      city.value = [];
      cityTemp.value = city.value;
    }

    if (disabledBasins.value.loaded) {
      hydrographicBasin.value = [];
      hydrographicBasinTemp.value = hydrographicBasin.value;
    }
  },
  { deep: true }
);

watch(
  () => groupReportsTemp,
  async (newVal) => {
    const isLeavingAnimalType =
      newVal.value.value !== 2 && showingDataFormatTemp.value.value === 3;
    const isEnteringBasinOnly = newVal.value.value == 5;
    if (isLeavingAnimalType || isEnteringBasinOnly) {
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
  () => store.state.report.currentBasinFilter,
  (newVal) => {
    hydrographicBasinTemp.value = newVal;
  },
  { immediate: true }
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
</script>
