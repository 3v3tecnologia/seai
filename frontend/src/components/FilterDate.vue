<template>
  <span class="p-float-label w-100">
    <!-- TODO  
    IMPLEMENTAR POSSIBILIDADE DO COMPONENT RECEBER DATA E HORA E ASSIM FORMATAR A HORA,
    FOCANDO NA HORA DE EDITAR A LEITURA-->
    <Calendar
      v-model="dates"
      dateFormat="dd/mm/y"
      inputId="date-range-read"
      :selectionMode="selectionMode"
      :manualInput="false"
      showIcon
      class="w-100"
      :time-only="timeOnly"
      :show-time="showTime"
      :hour-format="hourFormat"
      stepMinute="60"
    />
    <label for="date-range-read">{{ label }}</label>
  </span>
</template>

<script setup>
import moment from "moment";
import Calendar from "primevue/calendar";
import { ref, watch, defineEmits, defineProps, computed } from "vue";

const props = defineProps({
  label: {
    default: "Período",
    type: String,
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

// const valFormated = computed(() => moment(dates.value).format(props.dateFormat));
const dates = ref();

const emit = defineEmits(["update:modelValue"]);

watch(dates, (val) => {
  emit("update:modelValue", val);
});
</script>
