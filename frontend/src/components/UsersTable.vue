<template>
  <div>
    <div>
      <div class="wrapper-table">
        <div ref="table" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch, reactive, onMounted } from "vue";
import { useStore } from "vuex";

import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library

const table = ref(null); //reference to your table element
const tabulator = ref(null); //variable to hold your table

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
});

onMounted(() => {
  //instantiate Tabulator when element is mounted
  tabulator.value = new Tabulator(table.value, {
    data: props.users,
    reactiveData: false,
    columns,
    layout: "fitColumns",
  });
});

const filtersUsers = ref({
  search: null,
  usersType: null,
  page: 1,
});

const emit = defineEmits(["update:modelValue"]);

watch(filtersUsers, (val) => {
  emit("update:modelValue", val);
});
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px;
}
</style>
