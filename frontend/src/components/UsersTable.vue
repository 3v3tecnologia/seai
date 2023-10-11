<template>
  <div>
    <BaseModal v-if="showConfirmModal" :users="selectedUsers" />
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
            <span class="mr-lg-2"> Editar usuário </span>
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
            <span class="mr-lg-2"> Excluir usuário(s) </span>
            <font-awesome-icon class="text-white" icon="fa-solid fa-trash" />
          </button>

          <div class="px-lg-2" />

          <div class="d-flex justify-content-end">
            <div class="btn btn-success text-white">
              <router-link :to="{ name: 'create-user' }" class="text-white">
                <span class="mr-lg-2"> Adicionar novo usuário </span>
                <font-awesome-icon class="text-white" icon="fa-solid fa-plus" />
              </router-link>
            </div>
          </div>

          <div class="px-2 px-lg-2" />

          <button @click="getUsers" class="btn btn-primary">
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
import {
  defineProps,
  defineEmits,
  ref,
  watch,
  reactive,
  onMounted,
  computed,
} from "vue";
import { usersOptions } from "@/constants.js";
import BaseDropdown from "@/components/BaseDropdown.vue";
import BaseModal from "@/components/BaseModal.vue";
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

const columns = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    align: "center",
    headerSort: false,
    width: 80,
  },
  {
    title: "Nome",
    field: "name",
  },
  {
    title: "Email",
    field: "email",
  },
  {
    title: "Data de criação",
    field: "created_at",
    formatter: (col) => {
      return moment(col._cell.value).format("DD/MM/YYYY");
    },
  },
  {
    title: "Função",
    field: "role",
  },
  {
    title: "Status",
    field: "status",
    formatter: (col) => {
      if (col._cell.value) {
        return "Ativo";
      }
      return "Inativo";
    },
  },
];

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  getUsers: {
    type: Function,
    default: () => [],
  },
});

onMounted(() => {
  //instantiate Tabulator when element is mounted
  tabulator.value = new Tabulator(table.value, {
    data: props.users,
    reactiveData: false,
    columns,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 20,
    paginationSizeSelector: [...new Set([5, 10, 15, 20, 25, 30, 50, 100])].sort(
      (a, b) => a - b
    ),
    paginationCounter: "rows",
    locale: true,
    langs: {
      default: {
        pagination: {
          page_size: "Usuários Por Página",
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
            rows: "usuários",
            page: "páginas",
          },
        },
      },
    },
  });
});

defineEmits(["update:modelValue"]);

const filtersTable = computed(() => {
  const userTypeVal = userType.value.value ? userType.value?.title : "";
  const searchVal = search.value;

  return [
    {
      field: "role",
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

watch(
  () => props.users,
  (val) => {
    tabulator.value?.setData(val);
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
    return toast.warning("Não há usuário selecionado.");
  } else if (selectedUsers.value.length > 1) {
    return toast.warning("Selecione apenas um usuário.");
  }

  router.push({
    name: "edit-user",
    params: { id: selectedUsers.value[0]?.id },
  });

  // TODO
  // ENVIAR PARA ROTA DE EDIÇÃO DE USUÁRIO COM O ID DO USUÁRIO QUE ELE DESEJA EDITAR
};
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px;
}
</style>
