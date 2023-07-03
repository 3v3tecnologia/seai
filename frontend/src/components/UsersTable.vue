<template>
  <div>
    <div>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <BaseInput
          v-model="search"
          placeholder="Busque por email, nome ..."
          input-type="text"
        />
        <BaseSelect
          inline-label
          remove-margin
          v-model="userType"
          :options="usersOptions"
          label="Filtrar por"
        />
        <BaseInput
          v-model="search"
          placeholder="Busque por email, nome etc"
          input-type="text"
        />
        <BaseInput
          v-model="search"
          placeholder="Busque por email, nome etc"
          input-type="text"
        />
      </div>

      <div class="wrapper-table">
        <div ref="table" />
      </div>

      <div class="py-4 py-lg-5" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch, reactive, onMounted } from "vue";
import { usersOptions } from "@/constants";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useStore } from "vuex";

import { TabulatorFull as Tabulator } from "tabulator-tables";

const cleanUserType = usersOptions[0].title;
const table = ref(null);
const tabulator = ref(null);
const userType = ref(cleanUserType);
const search = ref("");

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

watch(search, (val) => {
  if (!val) {
    tabulator.value?.setFilter("name", "not in", []);
  } else {
    tabulator.value?.setFilter("name", "like", val);
  }
});

watch(userType, (val) => {
  if (val === cleanUserType) {
    tabulator.value?.setFilter("role", "not in", []);
  } else {
    tabulator.value?.setFilter("role", "=", val);
  }
});

// watch(filtersUsers, (val) => {
//   emit("update:modelValue", val);
// });
</script>

<style lang="scss" scoped>
@import "~tabulator-tables/dist/css/tabulator_bootstrap4.min.css";

.wrapper-table {
  border: 1px solid #4b4b4b59;
  border-radius: 5px;
}
</style>
