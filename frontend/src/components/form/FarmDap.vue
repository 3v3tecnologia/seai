<template>
  <div class="position-relative w-100 mt-4">
    <label v-if="label" class="font-weight-bold label">{{ label }} </label>
    <BaseTable
      ref="refBaseTable"
      v-model="inputValue"
      :hidePagination="hidePagination"
      :data="modelValue || emptyTableValue"
      :columns="columns"
      :selectable="false"
      :apiPagination="{}"
      :has-crud-rows="hasCrudRows"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import BaseTable from "@/components/tables/BaseTable.vue";

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
  columns: {
    type: Array,
    required: false,
    default: () => [],
  },
  hidePagination: {
    type: Boolean,
    default: true,
  },
  hasCrudRows: {
    type: Boolean,
    default: true,
  },
});

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
