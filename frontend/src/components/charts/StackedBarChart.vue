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

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({}),
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

const groupByLocation = (data) => {
  if (!data.length) {
    return {};
  }
  const groupdedData = {};

  const keyGroup = data[0]["Municipio"] ? "Municipio" : "Bacia";
  // console.log(data);
  const mapedKeysUnique = new Set(data.map((d) => d[keyGroup]));

  mapedKeysUnique.forEach((key) => {
    groupdedData[key] = data.filter((d) => d[keyGroup] === key);
  });

  return groupdedData;
};

const getUniqueStackKeys = (data, stackKey) => {
  return [...new Set(data.map((d) => d[stackKey]))];
};

const groupedData = computed(() => groupByLocation(props.data));

const seriesStackKeys = computed(() =>
  getUniqueStackKeys(props.data, props.stackKey)
);

const labels = computed(() => Object.keys(groupedData.value));

const series = computed(() =>
  seriesStackKeys.value.map((stack) => {
    const data = labels.value
      .map((l) => groupedData.value[l] || [])
      .map((l) => l.find((v) => v[props.stackKey] == stack))
      .map((l) => l[props.valueKey]);

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
      borderRadius: 10,
      dataLabels: {
        enabled: true,
        total: {
          offsetY: 2,
          enabled: true,
          formatter: function (val, opts) {
            return +val.toFixed(2);
          },
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
    type: "category",
    tickPlacement: "on",
    categories: labels.value,
  },
  legend: {
    position: "bottom",
    offsetY: 5,
  },
  fill: {
    opacity: 1,
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
}));
</script>
