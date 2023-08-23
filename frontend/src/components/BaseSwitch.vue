<template>
  <div class="d-flex align-items-center">
    <label class="mr-4 mb-0 font-weight-bold">
      <span class="mr-1"> {{ label }} </span>
    </label>
    <div class="custom-control custom-switch">
      <input
        v-model="inputValue"
        type="checkbox"
        class="custom-control-input"
        id="customSwitch1"
      />
      <label class="custom-control-label" for="customSwitch1"></label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  label: String,
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const inputValue = ref(true);

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});

const label = ref("Exibir por bacia");
</script>
