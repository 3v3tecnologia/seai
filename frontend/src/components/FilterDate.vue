<template>
  <span class="p-float-label">
    <Calendar
      v-model="dates"
      dateFormat="dd/mm/yy"
      inputId="date-range-read"
      selectionMode="range"
      :manualInput="false"
      showIcon
    />
    <label for="date-range-read">Data inicial - Data final</label>
  </span>
</template>

<script setup>
import Calendar from "primevue/calendar";
import { ref, watch, defineEmits } from "vue";

const dates = ref([]);

const emit = defineEmits(["update:modelValue"]);

watch(dates, (val) => {
  emit("update:modelValue", val);
});
</script>
