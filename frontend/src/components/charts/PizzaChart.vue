<template>
  <CardChart>
    <apexchart
      :width="props.width"
      type="pie"
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
  id: {
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
  width: {
    type: Number,
    default: 380,
    required: false,
  },
});

const dataDTO = props.data.map((val) => {
  return val ? val : 0;
});

const total = dataDTO.reduce((a, b) => a + b, 0);

const series = dataDTO
  .map((val) => val / total)
  .map((val) => Number(val.toFixed(2)));

const title = {
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
};
const options = {
  chart: {
    width: 380,
    type: "pie",
    // group: "chart-pie",
    id: props.id,
  },
  events: {
    dataPointSelection: (event, chartContext, config) => {
      console.log("apontou pra um ponto", event);
    },
  },
  tooltip: {
    y: {
      formatter: function (val, b) {
        const formattedVal = props.data[b.seriesIndex].toFixed(2);
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
