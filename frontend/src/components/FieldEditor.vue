<template>
  <div class="w-100 mt-4">
    <label class="font-weight-bold label">{{ label }} </label>
    <Editor v-model="textValue" editorStyle="height: 320px" />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";
import Editor from "primevue/editor";

const props = defineProps({
  label: {
    default: "Período",
    type: String,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  selectionMode: {
    default: "range",
    type: String,
  },
  timeOnly: {
    default: false,
    type: Boolean,
  },
  showTime: {
    default: false,
    type: Boolean,
  },
  hourFormat: {
    default: "24",
    type: String,
  },
  dateFormat: {
    default: "YYYY-MM-DD",
    type: String,
  },
});

const textValue = ref();

const emit = defineEmits(["update:modelValue"]);

watch(textValue, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    textValue.value = val;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.label {
  font-size: 1rem;
  color: #495057;
}
</style>
