<template>
  <div
    class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center"
  >
    <div class="d-lg-flex align-items-center ml-n3 mt-n4 mt-lg-0">
      <BaseDropdown
        v-for="filter in filtersDropdown"
        v-model="filtersDataTemp[filter.key]"
        :key="filter.key"
        :options="filter.options"
        :placeholder="filter.label"
        class="d-flex ml-3 mt-4 mt-lg-0"
      />

      <BaseCheckBox
        v-for="filter in filtersCheckbox"
        v-model="filtersDataTemp[filter.key]"
        :key="filter.key"
        remove-margin
        :disabled="filter.isDisabled"
        :options="filter.options"
        :label="filter.label"
        :placeholder="filter.label"
        class="ml-3 mt-3 mt-lg-0"
      />

      <div class="d-flex ml-3 mt-4 mt-lg-0">
        <button
          @click="applyFilters"
          :disabled="disabledApplyFilters"
          class="btn btn-success px-2 py-2"
        >
          Buscar dados
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseDropdown from "@/components/form/BaseDropdown.vue";
import BaseCheckBox from "@/components/form/BaseCheckBox.vue";

import { defineProps, ref, watch, defineEmits } from "vue";

const props = defineProps({
  filtersDropdown: {
    type: Array,
    required: false,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
  filtersCheckbox: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const filtersDataTemp = ref({});
const filtersData = ref({});

props.filtersDropdown.forEach((filter) => {
  filtersData.value[filter.key] = filter.options[0];
});

const applyFilters = () => {
  filtersData.value = JSON.parse(JSON.stringify(filtersDataTemp.value));
};

const disabledApplyFilters = false;

watch(
  () => filtersData.value,
  (val) => {
    filtersDataTemp.value = JSON.parse(JSON.stringify(val));
    emit("update:modelValue", val);

    console.log({ val });
  },
  { immediate: true }
);
</script>
