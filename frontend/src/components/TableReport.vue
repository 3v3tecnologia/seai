<template>
  <div class="w-100 d-flex flex-column align-items-start">
    <div class="w-100 d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 font-weight-bold">
        {{ title }}
      </h4>
      <button class="btn btn-success" @click="downloadCSV">Download CSV</button>
    </div>

    <div class="wrapper-table w-100">
      <div ref="table" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, watch } from "vue";

import { TabulatorFull as Tabulator } from "tabulator-tables";

const table = ref(null);
const tabulator = ref(null);

const fileName = () => {
  return props.title.toLowerCase().split(" ").join("_");
};

const downloadCSV = () => {
  tabulator.value.download("csv", `${fileName()}.csv`, { bom: true });
};

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
});

// Redraw data;
watch(
  () => props.data,
  (val) => {
    tabulator.value?.setData(val);
  }
);

// Redraw columns based on columns visibility;
watch(
  () => props.columns,
  (newValue, oldValue) => {
    const updateColumns = [];

    newValue.forEach((currentVal, i) => {
      const oldValLoop = oldValue[i];

      if (oldValLoop.visible != currentVal.visible) {
        updateColumns.push(currentVal);
      }

      updateColumns.forEach((val) =>
        tabulator.value.updateColumnDefinition(val.title, val)
      );
    });
  }
);

onMounted(() => {
  tabulator.value = new Tabulator(table.value, {
    data: props.data,
    reactiveData: false,
    columns: props.columns,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 5,
    paginationSizeSelector: [...new Set([5, 10, 15, 20, 25, 30, 50, 100])].sort(
      (a, b) => a - b
    ),
    paginationCounter: "rows",
    locale: true,
    langs: {
      default: {
        pagination: {
          page_size: "Linhas Por Página",
          page_title: "Selecionar Páginas",
          first: "Primeira",
          first_title: "Primeira Página",
          last: "Última",
          last_title: "Última Página",
          prev: "Anterior",
          prev_title: "Página Anterior",
          next: "Próxima",
          next_title: "Página Próxima",
          all: "Todas",
          counter: {
            showing: "Mostrando",
            of: "de",
            rows: "linhas",
            page: "páginas",
          },
        },
      },
    },
  });
});
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px;
}
</style>
