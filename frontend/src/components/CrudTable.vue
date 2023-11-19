<template>
  <div>
    <DeleteModal
      :action-text="actionText"
      v-if="showConfirmModal"
      :users="selectedUsers"
      :get-data-key="getDataKey"
      :delete-data-key="deleteDataKey"
    />

    <div>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center">
          <BaseInput
            remove-margin
            v-model="search"
            placeholder="Buscar"
            input-type="text"
            show-icon
            v-if="!hideSearch"
          />

          <div v-if="showDateRangeFilter" class="d-flex">
            <FilterDate v-model="dates" />
          </div>

          <div
            class="d-flex"
            v-if="allFiltersDrop.length == filtersValue.length"
          >
            <div v-for="(filter, i) in allFiltersDrop" :key="i" class="d-flex">
              <div class="px-lg-2" />
              <BaseDropdown
                inline-label
                remove-margin
                v-model="filtersValue[i].selected"
                :options="filter.options"
                :placeholder="filter.label"
              />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <primary-button @click="handleEditUser" class="btn btn-info">
            <span class="mr-lg-2"> Editar {{ actionText }} </span>
            <font-awesome-icon class="text-white" icon="fa-solid fa-pen" />
          </primary-button>

          <button
            v-if="deleteDataKey"
            type="button"
            data-toggle="modal"
            data-target="#exampleModal"
            @click="handleDeleteUsers"
            class="ml-4 btn btn-danger"
          >
            <span class="mr-lg-2"> Excluir {{ actionText }}(s) </span>
            <font-awesome-icon class="text-white" icon="fa-solid fa-trash" />
          </button>

          <div v-if="actionRoutes.create" class="d-flex justify-content-end">
            <router-link
              :to="{ name: actionRoutes.create }"
              class="ml-4 btn btn-success text-white"
            >
              <span class="mr-lg-2"> Adicionar novo {{ actionText }} </span>
              <font-awesome-icon class="text-white" icon="fa-solid fa-plus" />
            </router-link>
          </div>

          <div class="px-2 px-lg-2" />

          <button @click="getData" class="btn btn-primary">
            <font-awesome-icon class="text-white" icon="fa-solid fa-refresh" />
          </button>
        </div>
      </div>

      <BaseTable
        @selected="setSelectedUsers"
        :filters-table="filtersTable"
        :has-api-filters="hasApiFilters"
        :get-data-key="getDataKey"
        :data="data"
        :columns="columns"
        :action-text="actionText"
      />
      <div class="py-4 py-lg-5" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted, computed } from "vue";
import BaseDropdown from "@/components/BaseDropdown.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import BaseInput from "@/components/BaseInput.vue";
import FilterDate from "@/components/FilterDate.vue";
import BaseTable from "@/components/BaseTable.vue";
import { useRoute, useRouter } from "vue-router";

import { toast } from "vue3-toastify";
import { useStore } from "vuex";

const router = useRouter();

const selectedUsers = ref([]);
const showConfirmModal = ref(false);
const search = ref("");
const dates = ref([]);

const setSelectedUsers = (selecteds) => {
  selectedUsers.value = selecteds || [];
};

const store = useStore();

const props = defineProps({
  hideSearch: {
    type: Boolean,
    default: false,
  },
  showDateRangeFilter: {
    type: Boolean,
    default: false,
  },
  actionText: {
    type: String,
    required: true,
  },
  hasApiFilters: {
    type: Boolean,
    default: false,
  },
  stateFilters: {
    type: Array,
    required: true,
  },
  deleteDataKey: {
    type: String,
    required: true,
  },
  getDataKey: {
    type: String,
    required: true,
  },
  filters: {
    type: Array,
    required: true,
  },
  searchFilter: {
    type: Array,
    required: true,
  },
  storeDataKey: {
    type: String,
    required: true,
  },
  actionRoutes: {
    type: Object,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  getData: {
    type: Function,
    default: () => [],
  },
});

const filtersValue = ref([]);
const route = useRoute();
const currentRoute = computed(() => route.name);

defineEmits(["update:modelValue"]);

const formatFilterTable = (f) => {
  return {
    field: f.field,
    type: "like",
    value: f?.selected?.value ? f?.selected?.title : "",
  };
};

const formatSearchFilters = (f) => {
  const searchVal = search.value;

  return {
    field: f,
    type: "like",
    value: searchVal,
  };
};

const formatStateFilter = (f) => {
  const options = store.getters[f.getterKey];

  return {
    ...f,
    options,
  };
};

const allFiltersDrop = computed(() => {
  return [...props.filters, ...props.stateFilters.map(formatStateFilter)];
});

const allFiltersDropFields = computed(() => {
  return allFiltersDrop.value.map((f) => f.field);
});

const formatDateFilter = computed(() => {
  return [
    { field: "start", value: dates.value[0] || null },
    { field: "end", value: dates.value[1] || null },
  ];
});

const filtersTable = computed(() => {
  return [
    ...formatDateFilter.value,
    ...filtersValue.value.map(formatFilterTable),
    props.searchFilter.map(formatSearchFilters),
  ];
});

watch(
  () => currentRoute.value,
  () => {
    search.value = "";
    props.stateFilters.forEach((f) => store.dispatch(f.getListKey));
  }
);

watch(
  () => allFiltersDropFields.value,
  (newValue, oldValue) => {
    const isFirstTime = newValue && !oldValue;
    const tempOldVal = oldValue || [];
    const areDifferent = tempOldVal.join("") !== newValue.join("");

    if (isFirstTime || areDifferent) {
      filtersValue.value = allFiltersDrop.value.map((f) => {
        return {
          selected: f.options[0] || null,
          field: f.field,
        };
      });
    }
  },
  { immediate: true }
);

const handleDeleteUsers = () => {
  if (!selectedUsers.value.length) {
    showConfirmModal.value = false;
    return toast.warning(`Não há ${props.actionText} selecionado.`);
  }

  showConfirmModal.value = true;
};

const handleEditUser = () => {
  const id = selectedUsers.value[0]?.id ?? selectedUsers.value[0]?.Id;

  if (!selectedUsers.value.length) {
    return toast.warning(`Não há ${props.actionText} selecionado.`);
  } else if (selectedUsers.value.length > 1) {
    return toast.warning(`Selecione apenas um ${props.actionText}.`);
  }

  router.push({
    name: props.actionRoutes.edit,
    params: { id },
  });
};
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px 5px 0 0;
}
</style>
