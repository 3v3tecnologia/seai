<template>
  <div class="position-relative w-100 mt-4">
    <label v-if="label" class="font-weight-bold label mb-0">{{ label }} </label>

    <BaseTable
      ref="refBaseTable"
      v-model="inputValue"
      :hidePagination="hidePagination"
      :data="inputValue"
      :columns="columns"
      :selectable="false"
      :apiPagination="{}"
      :has-crud-rows="hasCrudRows"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import BaseTable from "@/components/tables/BaseTable.vue";

const emptyTableValue = [{ id: 1 }];

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  modelValue: {
    type: Object,
    required: false,
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

const inputValue = ref(JSON.parse(JSON.stringify(emptyTableValue)));

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
      return emit("update:modelValue", [{ id: 1 }]);
    }

    inputValue.value = val;
  }
);
</script>
