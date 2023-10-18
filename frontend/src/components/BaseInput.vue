<template>
  <div
    class="form-group"
    :class="{
      'mb-0': removeMargin,
    }"
  >
    <slot />
    <label v-if="label">{{ label }}</label>
    <input
      :disabled="disabled"
      v-model="inputValue"
      :type="inputType"
      class="form-control"
      :placeholder="placeholder"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, Ref, watch } from "vue";

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  inputRequired: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  removeMargin: {
    type: Boolean,
    default: false,
  },
  inputType: {
    type: String,
    default: "text",
  },
});

const inputValue: Ref<string> = ref("");

const emit = defineEmits(["update:modelValue"]);

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val || "";
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
label {
  font-weight: bold;
}
</style>
