<template>
  <CardChart>
    <apexchart
      class="h-100"
      :height="props.height"
      type="bar"
      :options="options"
      :series="series"
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
} from "./helpers";

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
  hasDataLabels: {
    type: Boolean,
    default: false,
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

const groupedData = computed(() => groupByKeyData(props.data));

const seriesStackKeys = computed(() =>
  getUniqueStackKeys(props.data, props.stackKey)
);

const labels = computed(() => labelsCharts(groupedData.value));

const series = computed(() =>
  seriesStackKeys.value.map((stack) => {
    const data = labels.value
      .map((l) => groupedData.value[l] || [])
      .map((l) => l.find((v) => v[props.stackKey] == stack))
      .map((l) => (l ? l[props.valueKey] : 0));

    return {
      name: stack,
      data,
    };
  })
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
    type: "bar",
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
  plotOptions: {
    bar: {
      horizontal: props.isHorizontal,
      // borderRadius: 10,
      dataLabels: {
        total: {
          offsetY: 2,
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
