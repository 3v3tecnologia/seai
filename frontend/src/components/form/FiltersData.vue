<template>
  <div
    class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center"
  >
    <div class="d-flex justify-content-between w-100-mob">
      <BaseDropdown
        v-for="filter in filters"
        :key="filter.key"
        v-model="filtersDataTemp[filter.key]"
        :options="filter.options"
        :placeholder="filter.label"
      />

      <div class="px-2"></div>

      <!-- <BaseDropdown
        v-model="showingDataFormatTemp"
        :options="showingDataOptions"
        placeholder="Agrupamento"
      /> -->
    </div>

    <!-- <div class="d-flex flex-lg-row flex-column mt-3 mb-4 my-lg-0">
      <div class="px-lg-2"></div>

      <BaseCheckBox
        inline-label
        remove-margin
        :disabled="disabledBasins.temp"
        v-model="hydrographicBasinTemp"
        :options="hydrographicBasinOptions"
        label="Bacias hidrográficas"
        placeholder="Bacias hidrográficas"
      />

      <div class="mt-3 my-lg-0 px-lg-2" />

      <BaseCheckBox
        inline-labe
        remove-margin
        v-model="cityTemp"
        :disabled="disabledCities.temp"
        :options="cityOptions"
        label="Municípios"
        placeholder="Municípios"
      />
    </div>

    <div class="d-flex">
      <div class="px-lg-4" />

      <button
        @click="applyFilters"
        :disabled="disabledGenerateReport"
        class="btn btn-success px-2 py-2"
      >
        Gerar relatório
      </button>
    </div> -->
  </div>
</template>

<script setup>
import BaseDropdown from "@/components/form/BaseDropdown.vue";
import BaseCheckBox from "@/components/form/BaseCheckBox.vue";

import { defineProps, ref } from "vue";

const props = defineProps({
  filters: {
    required: false,
    default: () => [],
  },
});

const filtersDataTemp = ref({});
</script>
