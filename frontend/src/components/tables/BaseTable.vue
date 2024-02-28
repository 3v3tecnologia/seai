<template>
  <div
    class="w-100 d-flex flex-column align-items-start"
    :class="{ 'mt-4': addMarginTop }"
  >
    <label v-if="label" class="font-weight-bold label mb-0">{{ label }} </label>

    <div v-if="isEditable">
      <button type="button" class="btn btn-success mr-4" @click="createNewLine">
        Adicionar linha
      </button>
      <button type="button" class="btn btn-danger" @click="removeLine">
        Remover linha
      </button>
    </div>

    <div
      v-if="isReport"
      class="w-100 d-flex flex-lg-row flex-column justify-content-lg-between align-items-lg-center"
    >
      <h4 class="text-left mb-2 mb-lg-0 font-weight-bold">
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

    <div class="wrapper-table w-100 mt-3 d-none">
      <div ref="tabDownload" />
    </div>

    <BasePagination
      v-if="!hidePagination"
      v-model="pageNumber"
      class="w-100"
      :is-loading="isLoading"
      :total-items="currentPagination.totalItems"
      :current-showing-items="dataShowing"
      :collection-text="actionText"
      :per-page="currentPagination.itemPerPage"
      :api-pagination="apiPagination"
    />
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  defineProps,
  watch,
  computed,
  defineEmits,
  defineExpose,
} from "vue";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import BasePagination from "@/components/tables/BasePagination.vue";
import { defaultPagination } from "@/constants";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const pageNumber = ref(1);

const table = ref(null);

const tabulator = ref(null);

const tabDownload = ref(null);
const tabulatorDownload = ref(null);

const fileName = () => {
  return props.title.toLowerCase().split(" ").join("_");
};

const downloadCSV = () => {
  tabulatorDownload.value.download("csv", `${fileName()}.csv`, { bom: true });
};

const downloadXLSX = () => {
  tabulatorDownload.value.download("xlsx", `${fileName()}.xlsx`, {
    sheetName: fileName(),
    bom: true,
  });
};

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    default: "",
  },
  apiPagination: {
    type: Object,
    required: false,
  },
  hidePagination: {
    type: Boolean,
    default: false,
  },
  addMarginTop: {
    type: Boolean,
    default: false,
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
  selectable: {
    type: Boolean,
    default: true,
  },
  hasCrudRows: {
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
const isEditable = computed(
  () => props.columns.find((c) => c.editor) && props.hasCrudRows
);
const currentRouteName = computed(() => currentRoute.name || "");
const biggestId = computed(
  () => Math.max(...props.data.map((c) => c.id || c.Id).filter((c) => c)) || 1
);

const store = useStore();
const baseTimeout = ref(null);
const isLoading = ref(true);

const newRowEmptyData = () => ({ id: biggestId.value + 1 });

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
  async (val) => {
    if (tabulator.value?.initialized) {
      tabulator.value?.setData(val);
    } else {
      setTimeout(() => tabulator.value?.setData(val), 200);
    }
  },
  { immediate: true }
);

const mapedFiltersTable = computed(() => {
  const mapedFiltersTable = {};

  if (props.filtersTable && props.filtersTable.length) {
    props.filtersTable.forEach((filter) => {
      if (filter.length) {
        mapedFiltersTable["search"] = filter[0].value;
      } else {
        mapedFiltersTable[filter.field] = filter.value;
      }
    });
  }

  return mapedFiltersTable;
});

watch(
  () => props.filtersTable,
  async (val) => {
    tabulator.value?.clearFilter();
    const filteredVal = val ? val.filter((f) => f.type || f.length) : [];

    tabulator.value?.setFilter(filteredVal);
  },
  { immediate: true }
);

const getData = async () => {
  isLoading.value = true;

  baseTimeout.value = setTimeout(async () => {
    await store.dispatch(props.getDataKey, {
      _itemId: paramId.value,
      pageNumber: pageNumber.value,
      ...mapedFiltersTable.value,
    });

    isLoading.value = false;
  }, 300);
};

defineExpose({ getData });

watch(
  () => [props.filtersTable, currentRouteName.value, pageNumber.value],
  async (newVal, oldVal) => {
    if (oldVal && newVal[2] === oldVal[2] && newVal[2] !== 1) {
      pageNumber.value = 1;
      return;
    }

    if (baseTimeout.value) {
      clearTimeout(baseTimeout.value);
    }

    if (props.getDataKey) {
      await getData();
    } else {
      isLoading.value = false;
    }
  },
  { immediate: true, deep: true }
);

const columnsDTO = computed(() => {
  return props.columns.map((c) => {
    c.headerSort = false;
    c.hozAlign = "center";
    c.headerHozAlign = "center";

    return c;
  });
});

// Redraw columns;
watch(
  () => [columnsDTO.value, props.data],
  (newValue) => {
    if (tabulator.value?.initialized) {
      tabulator.value?.setColumns(newValue[0]);
    }
  },
  { immediate: true, deep: true }
);

const emit = defineEmits(["selected", "update:modelValue"]);

const emitCurrentData = () =>
  emit("update:modelValue", tabulator.value.getData());

const createNewLine = async (e) => {
  await tabulator.value.addRow(newRowEmptyData(), false);
  emitCurrentData();
};

const removeLine = async () => {
  const currentIdsMaped = {};
  props.data.forEach((d) => (currentIdsMaped[d.id] = true));

  const selectedIds = tabulator.value
    .getSelectedData()
    ?.map((c) => c.id)
    ?.filter((c) => currentIdsMaped[c]);

  const selectedLength = selectedIds?.length;
  const totalDataLength = props.data.length;
  if (!selectedLength) {
    return;
  }

  await tabulator.value.deleteRow(selectedIds);
  await tabulator.value.deselectRow(selectedIds);

  if (selectedLength === totalDataLength) {
    await createNewLine();
  }

  emitCurrentData();
};

const updateSelecteds = (selecteds) => {
  emit("selected", selecteds);
};
onMounted(() => {
  tabulator.value = new Tabulator(table.value, {
    data: dataShowing.value,
    reactiveData: false,
    columns: columnsDTO.value,
    layout: "fitColumns",
    validationMode: "highlight",
    selectable: props.selectable,
    selectableRowsPersistence: false,
  });

  tabulatorDownload.value = new Tabulator(tabDownload.value, {
    data: props.data,
    reactiveData: false,
    columns: columnsDTO.value,
    layout: "fitColumns",
    validationMode: "highlight",
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

.wrapper-table :deep {
  & .tabulator-col-title {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: break-spaces !important;
  }

  .tabulator-col-content {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
  }
}
</style>
