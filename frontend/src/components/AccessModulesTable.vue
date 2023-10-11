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
          <tr v-for="(moduleOption, index) in modulesOptions" :key="index">
            <th scope="row" colspan="3">{{ moduleOption.title }}</th>
            <td>
              <div class="wrapper-select">
                <BaseDropdown
                  remove-margin
                  v-model="moduleOption.access.read"
                  :options="optionsSelect"
                  input-required
                />
              </div>
            </td>
            <td>
              <div class="wrapper-select">
                <BaseDropdown
                  remove-margin
                  v-model="moduleOption.access.register"
                  :options="optionsSelect"
                  input-required
                  :g-width="'100px'"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import BaseDropdown from "@/components/BaseDropdown.vue";
import { defineProps, defineEmits, ref, watch, computed } from "vue";

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

const baseValuesAccess = optionsSelect[1];
const baseAccessModules = {
  read: baseValuesAccess,
  register: baseValuesAccess,
};

const modulesOptions = ref([
  {
    id: 1,
    title: "Notícias",
    value: "news",
    access: JSON.parse(JSON.stringify(baseAccessModules)),
  },
  {
    id: 2,
    title: "Cadastro",
    value: "register",
    access: JSON.parse(JSON.stringify(baseAccessModules)),
  },
  {
    id: 3,
    title: "Usuários",
    value: "user",
    access: JSON.parse(JSON.stringify(baseAccessModules)),
  },
]);

const accessDTO = computed(() => {
  const keys = modulesOptions.value.map((c) => c.value);
  const accessformatted = {};

  keys.forEach((key, i) => {
    const moduleData = modulesOptions.value[i];
    const data = {
      id: moduleData.id,
      read: !!moduleData.access.read.value,
      write: !!moduleData.access.register.value,
    };

    accessformatted[key] = data;
  });

  return accessformatted;
});

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

const inputValue = ref(2);
const emit = defineEmits(["update:modelValue"]);

watch(
  accessDTO,
  (val) => {
    emit("update:modelValue", val);
  },
  { immediate: true }
);

// TODO IMPLEMENT LOGIC TO PUT ALL TRUE IF CAN REGISTER AND ALL FALSE IF CANT READ
// watch(modulesOptions.value, (newVal, oldVal) => {
//   const positiveOption = optionsSelect.find((opt) => opt.value);
//   const negativeOption = optionsSelect.find((opt) => !opt.value);

//   newVal.forEach((moduleOpt, index) => {
//     const oldRegisterValue = oldVal[index].access.register;
//     const newRegisterValue = newVal[index].access.register;

//     const oldReadValue = oldVal[index].access.read;
//     const newReadValue = newVal[index].access.read;
//     console.log(
//       "bb",
//       oldRegisterValue,
//       newRegisterValue,
//       oldReadValue,
//       newReadValue
//     );

//     if (
//       newRegisterValue == positiveOption?.title &&
//       oldRegisterValue == negativeOption?.title
//     ) {
//       moduleOpt.access.read = positiveOption?.title;
//     } else if (
//       oldReadValue == positiveOption?.title &&
//       newReadValue == negativeOption?.title
//     ) {
//       moduleOpt.access.register = negativeOption?.title;
//     }
//   });
// });
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
