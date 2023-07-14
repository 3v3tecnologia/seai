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

<script lang="ts" setup>
import { defineProps, ref, watch } from "vue";
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

const dataDTO = props.data.map((val) => {
  return val ? val : 0;
});

const seriesData = dataDTO.map((val) => Number(val.toFixed(2)));

const series = [{ name: props.seriesName, data: seriesData }];

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
    type: "bar",
    // group: "chart",
    id: props.id,
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
    labels: {
      show: false,
    },
  },
  yaxis: {
    reversed: props.isReversed,
  },
  tooltip: {
    y: {
      formatter: function (val, b) {
        let formattedVal = props.data[b.dataPointIndex].toFixed(2);

        if (props.formatter == "money") {
          formattedVal = props.data[b.dataPointIndex].toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });
        }

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
