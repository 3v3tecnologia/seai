<template>
  <div
    class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center"
    @keydown.enter="applyFilters"
  >
    <div class="d-lg-flex align-items-center ml-n3 mt-n4 mt-lg-0">
      <BaseInput
        v-if="searchFilter"
        remove-margin
        v-model="filtersDataTemp[searchFilter.key]"
        :placeholder="searchFilter.label || 'Buscar'"
        input-type="text"
        show-icon
        class="mb-lg-0 ml-3 mt-3 mt-lg-0"
      />

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
        :options="filterDependsOn(filter)"
        :label="filter.label"
        :placeholder="filter.label"
        class="ml-3 mt-3 mt-lg-0"
      />

      <div class="d-flex ml-3 mt-4 mt-lg-0">
        <button
          @click="applyFilters"
          :disabled="isDisabledButton"
          class="btn btn-success px-2 py-2"
        >
          Buscar dados
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseInput from "@/components/form/BaseInput.vue";
import BaseDropdown from "@/components/form/BaseDropdown.vue";
import BaseCheckBox from "@/components/form/BaseCheckBox.vue";

import { defineProps, ref, watch, defineEmits, computed } from "vue";

const props = defineProps({
  searchFilter: {
    type: Object,
    required: false,
    default: null,
  },
  filtersDropdown: {
    type: Array,
    required: false,
    default: () => [],
  },
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
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
  disabledSubmit: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "tempValues"]);

const filtersDataTemp = ref({});
const filtersData = ref({});

const seedFiltersDropdown = (val = {}) => {
  filtersData.value = val;

  props.filtersDropdown.forEach((filter) => {
    filtersData.value[filter.key] = filter.options[0];
  });

  filtersDataTemp.value = JSON.parse(JSON.stringify(val));
};

const seedFiltersCheckbox = () => {
  props.filtersCheckbox.forEach((filter) => {
    filtersData.value[filter.key] = [];
  });
};

const isDisabledButton = computed(
  () => props.disabledSubmit || !hasChanges.value
);

const applyFilters = () => {
  if (isDisabledButton.value) {
    return;
  }

  filtersData.value = JSON.parse(JSON.stringify(filtersDataTemp.value));
};

const filterDependsOn = (filterItem) => {
  const dependentKey = filterItem.dependsOn;
  const valueDemander = filtersDataTemp.value?.[dependentKey?.key];

  if (!dependentKey || !valueDemander?.length) {
    return filterItem.options;
  }

  const dependentValues = valueDemander.map((c) => c.value);
  const mapedValues = {};

  dependentValues.forEach((c) => (mapedValues[c] = true));

  return filterItem.options.filter((c) => mapedValues[c[dependentKey.value]]);
};

const concatValuesFilters = (filter) => {
  return Object.values(filter)
    .filter((c) => c)
    .map((c) => {
      if (typeof c === "string") {
        return c;
      } else if (c.length) {
        return c.map((k) => k.value).join("");
      }

      return c?.value;
    })
    .join("");
};

const hasChanges = computed(() => {
  const conactenedFiltersTemp = concatValuesFilters(filtersDataTemp.value);
  const conactenedFilters = concatValuesFilters(filtersData.value);

  return conactenedFilters != conactenedFiltersTemp;
});

seedFiltersCheckbox();
seedFiltersDropdown(props.modelValue);

watch(
  () => filtersData.value,
  (val) => emit("update:modelValue", val),
  { deep: true }
);

watch(
  () => filtersDataTemp.value,
  (val) => {
    const dependendingFiltersCheckbox = props.filtersCheckbox.filter(
      (c) => c.dependsOn
    );

    dependendingFiltersCheckbox.forEach((f) => {
      const dependentKey = f.dependsOn;
      const valueDemander = filtersDataTemp.value?.[dependentKey?.key];

      if (!dependentKey || !valueDemander?.length) {
        return;
      }

      const valuesDemanderMaped = {};

      valueDemander.forEach((f) => (valuesDemanderMaped[f.value] = true));

      val[f.key] = val[f.key]?.filter(
        (c) => valuesDemanderMaped[c[dependentKey.value]]
      );
    });

    emit("tempValues", val);
  },
  { deep: true }
);

watch(
  () => props.filtersDropdown,
  (val) => {
    val.forEach((filterDrop) => {
      if (!filtersDataTemp.value[filterDrop.key]) {
        return;
      }

      const notFound = !filterDrop.options.find(
        (opt) => opt.value == filtersDataTemp.value[filterDrop.key].value
      );

      if (notFound) {
        filtersDataTemp.value[filterDrop.key] = filterDrop.options[0];
      }
    });
  }
);
</script>
