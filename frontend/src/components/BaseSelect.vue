<template>
  <div class="form-group" :class="`${removeMargin ? 'mb-0' : ''}`">
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
label {
  font-weight: bold;
}
</style>
