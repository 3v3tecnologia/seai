<template>
  <CardChart>
    <apexchart
      :height="props.height"
      type="line"
      :options="options"
      :series="series"
    />
  </CardChart>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
import CardChart from "@/components/CardChart.vue";

const props = defineProps({
  data: {
    type: Array,
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
  group: {
    type: String,
    required: false,
  },
});

const dataDTO = props.data.map((val) => {
  return val ? val : 0;
});

const seriesData = props.data.map((val) => Number(val.toFixed(2)));

const series = [{ name: props.seriesName, data: seriesData }];

const title = {
  text: `${props.title}${props.tooltipSufix ? ` (${props.tooltipSufix})` : ""}`,
  align: "left",
  margin: 15,
  offsetX: 0,
  offsetY: 16,
  floating: false,
  style: {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "Secular One",
    color: "#263238",
  },
};
const options = {
  chart: {
    width: 400,
    type: "line",
    group: props.group,
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
          filename: undefined,
          show: false,
        },
      },
      autoSelected: "zoom",
    },
  },
  yaxis: {
    show: false,
  },
  // colors: props.color ? [props.color] : undefined,
  markers: {
    size: 4,
  },
  tooltip: {
    y: {
      formatter: function (val, b) {
        let formattedVal = props.data[b.dataPointIndex].toFixed(2);

        const sufix = props.tooltipSufix ? ` ${props.tooltipSufix}` : "";
        const prefix = props.tooltipPrefix ? `${props.tooltipPrefix} ` : "";

        return `${prefix}${formattedVal}${sufix}`;
      },
    },
  },
  title,
  labels: props.labels,
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
};
</script>
