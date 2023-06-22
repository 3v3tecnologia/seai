<template>
  <div class="form-group">
    <slot />
    <label>{{ label }}</label>
    <input
      v-model="inputValue"
      :type="inputType"
      class="form-control"
      :placeholder="placeholder"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, Ref, watch } from "vue";

defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  inputRequired: {
    type: Boolean,
    default: true,
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
</script>
