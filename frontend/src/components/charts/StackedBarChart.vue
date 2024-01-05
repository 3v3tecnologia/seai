<template>
  <CardChart>
    <apexchart
      v-if="seriesLoaded?.length"
      class="h-100"
      :height="props.height"
      type="bar"
      :options="optionsLoaded"
      :series="seriesLoaded"
    />
  </CardChart>
</template>

<script setup>
import { computed, defineProps, ref, watch } from "vue";
import CardChart from "@/components/CardChart.vue";
import {
  groupByKeyData,
  getUniqueStackKeys,
  labelsCharts,
  formatterPlot,
  formatterXTooltip,
  formatterLabels,
  dataLabels,
  mountSeries,
} from "../../helpers/charts";
import { useStore } from "vuex";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  groupByKey: {
    type: String,
    required: false,
  },
  stackKey: {
    type: String,
    required: true,
  },
  valueKey: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
    required: false,
  },
  seriesName: {
    type: String,
    default: "",
    required: false,
  },
  formatter: {
    type: String,
    default: "",
    required: false,
  },
  tooltipSufix: {
    type: String,
    default: "",
    required: false,
  },
  tooltipPrefix: {
    type: String,
    default: "",
    required: false,
  },
  labelBy: {
    type: Object,
    default: null,
    required: false,
  },
  isHorizontal: {
    type: Boolean,
    default: false,
    required: false,
  },
  height: {
    type: Number,
    default: 270,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
});

const optionsLoaded = ref({});
const seriesLoaded = ref([]);

const store = useStore();
const isLoadingReport = computed(() => store.state.isLoadingReport);

const groupedData = computed(() => groupByKeyData(props.data, props.labelBy));

const seriesStackKeys = computed(() =>
  getUniqueStackKeys(props.data, props.stackKey)
);

const labels = computed(() => labelsCharts(groupedData.value, props.labelBy));

const series = computed(() =>
  mountSeries(
    seriesStackKeys.value,
    labels.value,
    groupedData.value,
    props.stackKey,
    props.valueKey
  )
);

watch(
  () => isLoadingReport.value,
  (newval) => {
    if (!newval) {
      optionsLoaded.value = options.value;
      seriesLoaded.value = series.value;
    }
  },
  { immediate: true }
);

const title = computed(() => ({
  text: props.title,
  align: "left",
  margin: 10,
  offsetX: 0,
  offsetY: 0,
  floating: false,
  style: {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "Secular One",
    color: "#263238",
  },
}));

const options = computed(() => ({
  chart: {
    // group: "chart",
    id: props.id,
    stacked: true,
    toolbar: {
      show: true,
      export: {
        svg: {
          filename: props.title.split(" ").join("_"),
        },
        png: {
          filename: props.title.split(" ").join("_"),
        },
        csv: {
          filename: props.title.split(" ").join("_"),
        },
      },
    },
    zoom: {
      enabled: true,
    },
  },
  dataLabels,
  plotOptions: {
    bar: {
      horizontal: props.isHorizontal,
      // borderRadius: 10,
      dataLabels: {
        enabled: false,
        total: {
          enabled: true,
          formatter: formatterPlot,
          style: {
            fontSize: "11px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
    type: "category",
    // tickPlacement: "on",
    categories: labels.value,
    labels: {
      formatter: formatterLabels,
    },
  },
  legend: {
    position: "bottom",
    offsetY: 5,
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: true,
      formatter: formatterXTooltip,
    },
  },
  title: title.value,
}));
</script>
