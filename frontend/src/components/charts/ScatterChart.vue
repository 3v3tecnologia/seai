<template>
  <CardChart>
    <apexchart
      :height="props.height"
      type="scatter"
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
    type: Array,
    default: () => [],
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
    default: "group-scatter",
  },
});

const dataDTO = props.data.map((val) => {
  return val ? val : [0, 0];
});

const joinedSufix = props.tooltipSufix.length
  ? `${props.tooltipSufix.join("/")}`
  : "";

const seriesData = props.data.map((vals) =>
  vals.map((val) => Number(val.toFixed(2)))
);

// const series = [{ name: props.seriesName, data: seriesData }];
const series = props.labels.map((label, i) => {
  return {
    name: label,
    data: [seriesData[i]],
  };
});

const title = {
  text: `${props.title} (${joinedSufix})`,
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
    type: "scatter",
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
          filename: props.title.split(" ").join("_"),
        },
      },
      autoSelected: "zoom",
    },
  },
  // yaxis: {
  //   show: false,
  //   tickAmount: 10,
  // },
  xaxis: {
    // tickAmount: 10,
    show: false,
    labels: {
      formatter: function (val) {
        return parseFloat(val).toFixed(0);
      },
    },
  },
  // colors: props.color ? [props.color] : undefined,
  markers: {
    size: 6,
  },
  tooltip: {
    y: {
      formatter: function (val, b) {
        const formattedValues = props.data[b.dataPointIndex].map((val) =>
          val.toFixed(2)
        );
        const formattedLabel = formattedValues.map(
          (val, i) => `${val} ${props.tooltipSufix[i]}`
        );

        const result = (formattedValues[0] / formattedValues[1]).toFixed(2);

        const prefix = props.tooltipPrefix ? `${props.tooltipPrefix} ` : "";

        return `${prefix}${result} ${joinedSufix}`;

        // return `<span class="font-weight-bold">${prefix}${result} ${joinedSufix}</span> <span class="font-weight-normal">${formattedLabel.join(
        //   " / "
        // )}</span>`;
      },
    },
  },
  title,
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
