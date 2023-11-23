<template>
  <div class="w-100 d-flex flex-column align-items-start">
    <div
      v-if="isReport"
      class="w-100 d-flex justify-content-between align-items-center"
    >
      <h4 class="mb-0 font-weight-bold">
        {{ title }}
      </h4>

      <div class="d-flex">
        <button class="btn mr-2 btn-success" @click="downloadCSV">
          Download CSV
        </button>
        <button class="btn btn-success" @click="downloadXLSX">
          Download XLSX
        </button>
      </div>
    </div>

    <div class="wrapper-table w-100 mt-3">
      <div ref="table" />
    </div>

    <BasePagination
      v-model="pageNumber"
      class="w-100"
      :total-items="currentPagination.totalItems"
      :current-showing-items="dataShowing"
      :collection-text="actionText"
      :per-page="currentPagination.itemPerPage"
      :api-pagination="apiPagination"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, watch, computed, defineEmits } from "vue";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import BasePagination from "@/components/BasePagination.vue";
import { defaultPagination } from "@/constants";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const pageNumber = ref(1);

const table = ref(null);
const tabulator = ref(null);
const fileName = () => {
  return props.title.toLowerCase().split(" ").join("_");
};

const downloadCSV = () => {
  tabulator.value.download("csv", `${fileName()}.csv`, { bom: true });
};

const downloadXLSX = () => {
  tabulator.value.download("xlsx", `${fileName()}.xlsx`, {
    sheetName: fileName(),
    bom: true,
  });
};

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  apiPagination: {
    type: Object,
    required: false,
  },
  getDataKey: {
    type: String,
    required: false,
  },
  filtersTable: {
    type: Array,
    default: null,
  },
  isReport: {
    type: Boolean,
    default: false,
  },
  actionText: {
    type: String,
    default: "linha",
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

const currentRoute = useRoute();
const paramId = computed(() => currentRoute.params.id || "");
const currentRouteName = computed(() => currentRoute.name || "");
const store = useStore();
const baseTimeout = ref(null);

const currentPagination = computed(() => {
  let { itemPerPage } = defaultPagination;
  let totalItems = props.apiPagination?.total || props.data.length;

  return {
    itemPerPage,
    totalItems,
  };
});

const dataShowing = computed(() => {
  if (props.apiPagination) {
    return props.data;
  }

  const currentEnd = currentPagination.value.itemPerPage * pageNumber.value;
  const currentStart = currentEnd - currentPagination.value.itemPerPage;

  return props.data.slice(currentStart, currentEnd);
});

watch(
  () => dataShowing.value,
  (val) => {
    if (tabulator.value?.initialized) {
      tabulator.value?.setData(val);
    }
  }
);

const mapedFiltersTable = computed(() => {
  const mapedFiltersTable = {};

  if (props.filtersTable && props.filtersTable.length) {
    props.filtersTable.forEach((filter) => {
      mapedFiltersTable[filter.field] = filter.value;
    });
  }

  return mapedFiltersTable;
});

watch(
  () => props.filtersTable,
  async (val) => {
    tabulator.value?.clearFilter();
    const filteredVal = val ? val.filter((f) => f.type) : [];

    tabulator.value?.setFilter(filteredVal);
  },
  { immediate: true }
);

watch(
  () => [props.filtersTable, currentRouteName.value, pageNumber.value],
  async () => {
    if (baseTimeout.value) {
      clearTimeout(baseTimeout.value);
    }

    // TODO
    // FAZER COM QUE MUDAR PAGINAÇÃO ATUALIZE A BUSCA DE DADOS
    // NÃO TA RODANDO AQUI PQ FALTA ELE DAR WATCH NELE TAMBÉM

    if (props.getDataKey) {
      baseTimeout.value = setTimeout(async () => {
        await store.dispatch(props.getDataKey, {
          _itemId: paramId.value,
          pageNumber: pageNumber.value,
          ...mapedFiltersTable.value,
        });
      }, 300);
    }
  },
  { immediate: true, deep: true }
);

// Redraw columns;
watch(
  () => props.columns,
  (newValue) => {
    tabulator.value?.setColumns(newValue);
  }
);

const emit = defineEmits(["selected"]);

const updateSelecteds = (selecteds) => {
  emit("selected", selecteds);
};

onMounted(() => {
  tabulator.value = new Tabulator(table.value, {
    data: dataShowing.value,
    reactiveData: false,
    columns: props.columns,
    layout: "fitColumns",
  });

  tabulator.value.on(
    "rowSelectionChanged",
    function (data, rows, selected, deselected) {
      updateSelecteds(rows.map((row) => row._row.data));
    }
  );
});
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px;
}
</style>
