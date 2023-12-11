<template>
  <div
    class="form-group"
    :class="{
      'mb-0': removeMargin,
    }"
  >
    <slot />
    <label v-if="label">{{ label }}</label>
    <div class="wrapper-input position-relative">
      <input
        style="height: 49.6px"
        :disabled="disabled"
        v-model="inputValue"
        :minlength="minLength"
        :type="inputType"
        class="form-control"
        :placeholder="placeholder"
      />
      <i
        v-if="showIcon"
        class="pi pi-search pr-2 d-flex position-absolute"
        :style="`
          color: #708090;
          right: 0; top: 0;
          bottom: 0;
          display: flex;
          pointer-events: none;
          align-items: center;
        `"
      ></i>
    </div>
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
  showIcon: {
    type: Boolean,
    default: false,
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
  minLength: {
    type: Number,
    default: 0,
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
