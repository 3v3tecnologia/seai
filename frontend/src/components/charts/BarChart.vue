<template>
  <CardChart>
    <apexchart
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
  formatterLabels,
  formatterXTooltip,
  groupByKeyData,
  labelsCharts,
} from "../../helpers/charts";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  groupByKey: {
    type: String,
    required: false,
  },
  valueKey: {
    type: String,
    required: true,
  },
  labels: {
    type: Array,
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
  isReversed: {
    type: Boolean,
    default: false,
    required: false,
  },
  color: {
    type: String,
    default: "",
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

const groupedData = computed(() =>
  groupByKeyData(props.data, props.groupByKey)
);

const labels = computed(() => labelsCharts(groupedData.value));

const orderedData = computed(() => {
  const totalData = [];

  labels.value.forEach((d) => {
    totalData.push(...groupedData.value[d]);
  });

  return totalData.map((d) =>
    d[props.valueKey] ? +d[props.valueKey].toFixed(2) : 0
  );
});

const series = computed(() => [
  { name: props.seriesName, data: orderedData.value },
]);

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
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
      },
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
  },
  // fill: {
  //   colors: props.color ? [props.color] : undefined,
  // },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: props.isHorizontal,
    },
  },
  xaxis: {
    type: "category",
    categories: labels.value,
    labels: {
      formatter: formatterLabels,
    },
  },
  legend: {
    show: false,
    position: "bottom",
    offsetY: -5,
  },
  fill: {
    opacity: 1,
  },
  yaxis: {
    reversed: props.isReversed,
  },
  tooltip: {
    x: {
      show: true,
      formatter: formatterXTooltip,
    },
  },
  // tooltip: {
  //   y: {
  //     formatter: function (val, b) {
  //       let formattedVal = props.data[b.dataPointIndex].toFixed(2);

  //       if (props.formatter == "money") {
  //         formattedVal = props.data[b.dataPointIndex].toLocaleString("pt-br", {
  //           style: "currency",
  //           currency: "BRL",
  //         });
  //       }

  //       const sufix = props.tooltipSufix ? ` ${props.tooltipSufix}` : "";
  //       const prefix = props.tooltipPrefix ? `${props.tooltipPrefix} ` : "";

  //       return `${prefix}${formattedVal}${sufix}`;
  //     },
  //   },
  // },
  title: title.value,
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
}));
</script>
