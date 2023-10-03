<template>
  <div class="row">
    <div class="col-lg-12 mb-2">
      <div v-if="currentReport.value === 1">
        <TableReport
          v-for="(report, i) in generalReports"
          :key="report.title"
          :class="i ? 'mt-4' : ''"
          :data="report.data"
          :title="report.title"
          :columns="report.columns"
        />
      </div>
    </div>
    <div class="col-lg-12">
      <div class="wrapper-table">
        <div ref="table" />
      </div>
    </div>
  </div>
</template>

<script setup>
import TableReport from "../TableReport.vue";
import { toast } from "vue3-toastify";
import { ref, defineProps, computed } from "vue";

const table = ref(null);
const tabulator = ref(null);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  showCities: {
    type: Boolean,
    default: false,
  },
  currentReport: {
    type: Object,
    default: () => ({}),
  },
});

const basicColumns = computed(() => [
  {
    title: "Bacia",
    field: "Bacia",
  },
  {
    title: "Municipio",
    field: "Municipio",
    visible: props.showCities,
  },
]);

const generalReports = computed(() => [
  {
    title: "Quantidade de registrados",
    columns: [
      ...basicColumns.value,
      {
        title: "Valor",
        field: "Quantidade",
      },
    ],
    data: props.data.registeredCount,
  },
  {
    title: "Quantidade de trabalhadores (média)",
    columns: [
      ...basicColumns.value,
      {
        title: "Tipo",
        field: "Tipo",
      },
      {
        title: "Valor",
        field: "Média de trabalhadores",
      },
    ],
    data: props.data.workersCount,
  },
  {
    title: "Captação mensal",
    columns: [
      ...basicColumns.value,
      {
        title: "Captação",
        field: "Captação",
      },
      {
        title: "Vazão média",
        field: "Vazão média",
      },
      {
        title: "Volume médio",
        field: "Volume médio",
      },
    ],
    data: props.data.captationCount,
  },
]);

const downloadData = (type) => {
  try {
    tabulator.value.downloadToTab(`${type}`, `seai_indicadores.${type}`, {
      bom: true,
    });

    toast.success("Dados baixados com sucesso", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  } catch (e) {
    return toast.error("Ocorreu um erro ao baixar arquivo.", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }
};

const downloadCSV = () => {
  downloadData("csv");
};
</script>
