<template>
  <div class="row">
    <div class="col-lg-12 d-flex mb-2">
      <button class="btn btn-success mr-2" @click="downloadCSV">
        Download CSV
      </button>
      <!-- <button class="btn btn-success mr-2" @click="downloadJSON">
        Download json
      </button> -->
    </div>
    <div class="col-lg-12">
      <div class="wrapper-table">
        <div ref="table" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { toast } from "vue3-toastify";
import { ref, defineProps, onMounted } from "vue";

const table = ref(null);
const tabulator = ref(null);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  {
    title: "Bacia",
    field: "basin",
    headerTooltip: true,
  },
  {
    title: "Cidade",
    field: "city",
    headerTooltip: true,
    formatter: (col) => {
      return col._cell.value ?? "Todas";
    },
  },
  {
    title: "Rendimento (R$)",
    field: "anuallyEarn",
    headerTooltip: true,
  },
  {
    title: "Produção (kg)",
    field: "anuallyProduction",
    headerTooltip: true,
  },
  {
    title: "Consumo de água (m³)",
    field: "anuallyWaterConsumeBar",
    headerTooltip: true,
  },
  {
    title: "Consumo por hectare (m³/ha)",
    field: "anuallyWaterCPI",
    headerTooltip: true,
  },
  {
    title: "Segurança Econômica (R$/ha)",
    field: "productiveSecurityKg",
    headerTooltip: true,
  },
  {
    title: "Segurança produtiva (kg/ha)",
    field: "productiveSecurityEarn",
    headerTooltip: true,
  },
  {
    title: "Segurança econômica (R$/ha)",
    field: "productiveSecurityEarn",
    headerTooltip: true,
  },
  {
    title: "Segurança social (empregos/ha)",
    field: "productiveSecurityEarn",
    headerTooltip: true,
  },
];

onMounted(() => {
  //instantiate Tabulator when element is mounted
  tabulator.value = new Tabulator(table.value, {
    data: props.data,
    reactiveData: false,
    columns,
    layout: "fitColumns",
  });
});

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

const downloadJSON = () => {
  downloadData("json");
};
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px;
}
</style>
