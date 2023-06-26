<template>
  <div class="wrapper-component">
    <label for="table" class="font-weight-bold"> Acessos </label>

    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr>
            <th scope="col" colspan="3">Módulos</th>
            <th scope="col">Leitura</th>
            <th scope="col">Escrita</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="moduleOption in modulesOptions" :key="moduleOption.value">
            <th scope="row" colspan="3">{{ moduleOption.title }}</th>
            <td>
              <div class="wrapper-select">
                <BaseSelect
                  remove-margin
                  v-model="moduleOption.access.read"
                  :options="optionsSelect"
                  input-required
                />
              </div>
            </td>
            <td>
              <div class="wrapper-select">
                <BaseSelect
                  remove-margin
                  v-model="moduleOption.access.register"
                  :options="optionsSelect"
                  input-required
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseSelect from "@/components/BaseSelect.vue";
import { defineProps, defineEmits, ref, Ref, watch } from "vue";

const optionsSelect = [
  {
    title: "Sim",
    value: 1,
  },
  {
    title: "Não",
    value: 0,
  },
];

const baseValuesAccess = optionsSelect[1].title;
const baseAccessModules = {
  read: baseValuesAccess,
  register: baseValuesAccess,
};

const modulesOptions = [
  {
    title: "Notícias",
    value: "reports",
    access: baseAccessModules,
  },
  {
    title: "Cadastro",
    value: "register",
    access: baseAccessModules,
  },
  {
    title: "Usuários",
    value: "users",
    access: baseAccessModules,
  },
];

defineProps({
  label: String,
  modelValue: String || Number,
  inputRequired: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const inputValue: Ref<number | string> = ref(2);
const emit = defineEmits(["update:modelValue"]);

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});
</script>

<style lang="scss" scoped>
.wrapper-table {
  border: 1px solid rgba(0, 0, 0, 0.35);
  max-height: 215px;
  overflow-y: scroll;

  & * {
    color: black !important;
  }

  thead {
    background-color: rgba(0, 0, 0, 0.15);
  }

  tbody {
    th {
      font-size: 0.95rem;
    }
  }

  tr {
    & > * {
      vertical-align: middle;

      .wrapper-select {
        max-width: 90px;
      }
    }
  }
}
</style>
