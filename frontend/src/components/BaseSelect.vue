<template>
  <div
    class="wrapper-select form-group"
    :class="{
      'mb-0': removeMargin,
      'inline-label': inlineLabel,
    }"
  >
    <label v-if="label">{{ label }}</label>

    <select
      :multiple="multiple"
      v-model="inputValue"
      class="form-control"
      :required="inputRequired"
    >
      <option v-for="option in options" :key="option.value">
        {{ option.title }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, Ref, watch } from "vue";

const props = defineProps({
  label: String,
  modelValue: String || Number,
  inputRequired: {
    type: Boolean,
    default: true,
  },
  inlineLabel: {
    type: Boolean,
    default: false,
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

const inputValue: Ref<number | string> = ref(2);

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val || 0;
  },
  { immediate: true }
);

const emit = defineEmits(["update:modelValue"]);

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});
</script>

<style lang="scss" scoped>
.wrapper-select {
  label {
    font-weight: bold;
  }

  &.inline-label {
    display: flex;
    align-items: center;

    label {
      margin-right: 1.3rem;
      margin-bottom: 0 !important;
      text-wrap: nowrap;
    }

    select {
      max-width: 200px;
    }
  }
}
</style>
