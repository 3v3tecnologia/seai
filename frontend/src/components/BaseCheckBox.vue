<template>
  <span class="p-float-label">
    <MultiSelect
      v-model="inputValue"
      :options="options"
      optionLabel="title"
      :placeholder="placeholder"
      class="wrapper-check"
      :disabled="disabled"
      display="chip"
    />
    <label for="dd-city"
      >{{ placeholder }}
      {{ inputValue.length ? `(${inputValue.length})` : "" }}</label
    >
  </span>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import MultiSelect from "primevue/multiselect";

const props = defineProps({
  label: String,
  modelValue: Object,
  inputRequired: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inlineLabel: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  removeMargin: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const tempInterval = ref(null);

const inputValue = ref([]);

const emit = defineEmits(["update:modelValue"]);

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.wrapper-check {
  & :deep .p-multiselect-label-container {
    max-width: 200px;
    min-width: 200px;
  }
}
</style>
