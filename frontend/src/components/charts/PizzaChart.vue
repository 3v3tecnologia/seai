<template>
  <CardChart is-centered style="max-height: 282.9px; min-height: 282.9px">
    <apexchart
      ref="pizzaChart"
      class="h-100"
      :width="props.width"
      :height="hasMonthlyFilter ? 'auto' : props.width"
      type="pie"
      :options="options"
      :series="series"
    />
  </CardChart>
</template>

<script setup>
import { computed, defineProps, ref, watch } from "vue";
import CardChart from "@/components/charts/CardChart.vue";

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
  hasMonthlyFilter: {
    type: Boolean,
    default: false,
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

const dataDTO = computed(() =>
  props.data.map((val) => {
    return val ? val : 0;
  })
);
const total = computed(() => dataDTO.value.reduce((a, b) => a + b, 0));

const calcPercent = (val) =>
  total.value ? +(val / total.value).toFixed(3) : 0;

let series = computed(() => dataDTO.value.map(calcPercent));

const pizzaChart = ref(null);

const title = {
  text: props.title,
  align: "left",
  margin: 10,
  offsetX: 0,
  offsetY: -10,
  floating: false,
  style: {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "Secular One",
    color: "#263238",
  },
};

const options = computed(() => ({
  chart: {
    width: 380,
    type: "pie",
    // group: "chart-pie",
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
  tooltip: {
    y: {
      formatter: function (val, b) {
        const formattedVal = props.data[b.seriesIndex].toFixed(2);
        const sufix = props.tooltipSufix ? ` ${props.tooltipSufix}` : "";
        const prefix = props.tooltipPrefix ? `${props.tooltipPrefix} ` : "";

        return `${(val * 100).toFixed(1)}% (${prefix}${formattedVal}${sufix})`;
      },
    },
  },
  title,
  labels: props.labels,
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          show: true,
          position: "bottom",
        },
        chart: {
          width: 200,
          toolbar: {
            show: false,
          },
        },
      },
    },
  ],
}));
</script>
