<template>
  <div class="position-relative w-100 mt-4">
    <label class="font-weight-bold label">{{ label }} </label>
    <BaseTable
      ref="refBaseTable"
      v-model="inputValue"
      :hidePagination="hidePagination"
      :data="modelValue || emptyTableValue"
      :columns="columns"
      :selectable="false"
      :apiPagination="{}"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import { farmsStageDefault } from "@/constants";

const emptyTableValue = [{ id: 1 }];

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  hidePagination: {
    type: Boolean,
    default: true,
  },
});

const columns = [
  {
    formatter: "rowSelection",
    titleFormatter: "",
    align: "center",
    headerSort: false,
    width: 80,
  },
  {
    title: "Estágio",
    field: "Stage_Title",
    editor: "input",
    mutator: (a, b, c, d, e) => {
      if (a && a.length >= 50) {
        return a.slice(50);
      } else if (a) {
        return a;
      }

      return farmsStageDefault;
    },
  },
  {
    title: "id",
    field: "id",
    visible: false,
  },
  {
    title: "Duração (dias)",
    field: "Duration_In_Days",
    editor: "number",
    mutator: (value) => Math.floor(value) || 1,
    editorParams: {
      min: 1,
    },
  },
  {
    title: "KC",
    field: "KC",
    editor: "number",
    editorParams: {
      min: 0.1,
      step: 0.1,
    },
    mutator: (value) => (value >= 0.1 ? value : 0.1),
  },
];

const inputValue = ref([]);

const emit = defineEmits(["update:modelValue"]);

watch(
  () => inputValue.value,
  (val) => {
    emit("update:modelValue", val);
  }
);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      emit("update:modelValue", [{ id: 1 }]);
    }
  }
);
</script>
