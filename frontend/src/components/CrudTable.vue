<template>
  <div>
    <UsersDeleteModal v-if="showConfirmModal" :users="selectedUsers" />
    <div>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center">
          <BaseInput
            remove-margin
            v-model="search"
            placeholder="Busque por email ou nome"
            input-type="text"
          />

          <div class="px-lg-4" />

          <BaseDropdown
            inline-label
            remove-margin
            v-model="userType"
            :options="usersOptions"
            label="Filtrar por"
          />
        </div>

        <div class="d-flex align-items-center">
          <primary-button @click="handleEditUser" class="btn btn-info">
            <span class="mr-lg-2"> Editar {{ actionText }} </span>
            <font-awesome-icon class="text-white" icon="fa-solid fa-pen" />
          </primary-button>

          <div class="px-lg-2" />

          <button
            type="button"
            data-toggle="modal"
            data-target="#exampleModal"
            @click="handleDeleteUsers"
            class="btn btn-danger"
          >
            <span class="mr-lg-2"> Excluir {{ actionText }}(s) </span>
            <font-awesome-icon class="text-white" icon="fa-solid fa-trash" />
          </button>

          <div class="px-lg-2" />

          <div class="d-flex justify-content-end">
            <router-link
              :to="{ name: actionRoutes.create }"
              class="btn btn-success text-white"
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

      <div class="wrapper-table">
        <div ref="table" />
      </div>

      <div class="py-4 py-lg-5" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted, computed } from "vue";
import { usersOptions } from "@/constants.js";
import BaseDropdown from "@/components/BaseDropdown.vue";
import UsersDeleteModal from "@/components/UsersDeleteModal.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useRouter } from "vue-router";

import { TabulatorFull as Tabulator } from "tabulator-tables";
import { toast } from "vue3-toastify";
import moment from "moment";

const router = useRouter();

const table = ref(null);
const tabulator = ref(null);
const selectedUsers = ref([]);
const showConfirmModal = ref(false);
const userType = ref(usersOptions[0]);
const search = ref("");

const setSelectedUsers = () => {
  selectedUsers.value = tabulator.value?.getSelectedData() || [];
};

const props = defineProps({
  actionText: {
    type: String,
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

const generateTabulatorLang = (key, text) => {
  const pageSize = `${text[0].toUpperCase() + text.slice(1)}s Por Página`;
  const rows = `${text}s`;

  return {
    [key]: {
      pagination: {
        page_size: pageSize,
        page_title: "Selecionar Páginas",
        first: "Primeira",
        first_title: "Primeira Página",
        last: "Última",
        last_title: "Última Página",
        prev: "Anterior",
        prev_title: "Página Anterior",
        next: "Próxima",
        next_title: "Página Próxima",
        all: "Todas",
        counter: {
          showing: "Mostrando",
          of: "de",
          rows,
          page: "páginas",
        },
      },
    },
  };
};

const langs = {
  ...generateTabulatorLang("users", "usuário"),
  ...generateTabulatorLang("equipments", "equipamento"),
};

onMounted(() => {
  //instantiate Tabulator when element is mounted
  tabulator.value = new Tabulator(table.value, {
    data: props.data,
    reactiveData: false,
    columns: props.columns,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 20,
    paginationSizeSelector: [...new Set([5, 10, 15, 20, 25, 30, 50, 100])].sort(
      (a, b) => a - b
    ),
    paginationCounter: "rows",
    locale: true,
    langs,
  });

  tabulator.value.on("tableBuilt", () => {
    tabulator.value?.setLocale?.(props.storeDataKey);
  });
});

defineEmits(["update:modelValue"]);

const filtersTable = computed(() => {
  const userTypeVal = userType.value.value ? userType.value?.title : "";
  const searchVal = search.value;

  return [
    {
      field: "type",
      type: "like",
      value: userTypeVal,
    },
    [
      {
        field: "name",
        type: "like",
        value: searchVal,
      },
      {
        field: "email",
        type: "like",
        value: searchVal,
      },
    ],
  ];
});

watch(
  () => filtersTable.value,
  (val) => {
    tabulator.value?.setFilter(val);
  },
  { immediate: true }
);

// Redraw data;
watch(
  () => props.data,
  (val) => {
    if (tabulator.value?.initialized) {
      tabulator.value?.setData(val);
    }
  },
  { immediate: true }
);

// Redraw columns;
watch(
  () => props.columns,
  (newValue) => {
    tabulator.value?.setColumns(newValue);
  }
);

watch(
  () => props.storeDataKey,
  (newValue) => {
    tabulator.value?.setLocale(newValue);
  },
  { immediate: true }
);

const handleDeleteUsers = () => {
  setSelectedUsers();

  if (!selectedUsers.value.length) {
    showConfirmModal.value = false;
    return toast.warning("Não há usuários selecionados.");
  }

  showConfirmModal.value = true;
};

const handleEditUser = () => {
  setSelectedUsers();

  if (!selectedUsers.value.length) {
    return toast.warning(`Não há ${props.actionText} selecionado.`);
  } else if (selectedUsers.value.length > 1) {
    return toast.warning(`Selecione apenas um ${props.actionText}.`);
  }

  router.push({
    name: props.actionRoutes.edit,
    params: { id: selectedUsers.value[0]?.id },
  });
};
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px;
}
</style>
