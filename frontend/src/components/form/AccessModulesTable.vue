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
                  :disabled="moduleOption.isDisabled || !!props.userType.value"
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
                  :disabled="moduleOption.isDisabled || !!props.userType.value"
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
import BaseDropdown from "@/components/form/BaseDropdown.vue";
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
    isDisabled: true,
  },
  {
    id: 4,
    title: "Rotina de dados",
    value: "jobs",
    access: JSON.parse(JSON.stringify(baseAccessModules)),
    isDisabled: true,
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

const props = defineProps({
  label: String,
  modelValue: {
    type: Object,
    required: true,
  },
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
  userType: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

watch(
  () => modulesOptions.value,
  (val, oldVal) => {
    val.forEach((perm, i) => {
      const somethingChanged =
        oldVal[i].access.register.value !== perm.access.register.value &&
        oldVal[i].access.read.value !== perm.access.read.value;
      const hadNoPermition = !(
        oldVal[i].access.register.value && oldVal[i].access.read.value
      );
      const hasNoPermition = !perm.access.read.value;
      const hasAllPermition = !perm.access.read.value;
      const canOnlyRead = perm.access.read.value && !perm.access.register.value;

      if (!somethingChanged) {
        return;
      }

      if (hadNoPermition && perm.access.register.value) {
        perm.access.read = optionsSelect[0];
      }
    });
  },
  { deep: true }
);

watch(
  accessDTO,
  (val) => {
    emit("update:modelValue", val);
  },
  { immediate: true }
);

const getOption = (val) => (val ? optionsSelect[0] : optionsSelect[1]);

watch(
  () => props.modelValue,
  (val) => {
    if (!val || !Object.keys(val).length) {
      return;
    }

    modulesOptions.value.forEach((module) => {
      const read = getOption(val?.[module.value]?.read);
      const write = getOption(val?.[module.value]?.write);

      module.access.read = read;
      module.access.register = write;
    });
  },
  { immediate: true }
);

watch(
  () => props.userType.value,
  (val) => {
    const permissionOptionIndex = val ? 0 : 1;
    const optionDefault = optionsSelect[permissionOptionIndex];

    if (permissionOptionIndex) {
      modulesOptions.value
        .filter((m, i) => i >= 2)
        .map((m) => {
          m.access.read = optionDefault;
          m.access.register = optionDefault;
        });
    } else {
      modulesOptions.value.forEach((item) => {
        const itemPermission = item.access;
        itemPermission.read = optionDefault;
        itemPermission.register = optionDefault;
      });
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.wrapper-table {
  border: 1px solid rgba(0, 0, 0, 0.35);
  // max-height: 215px;
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
