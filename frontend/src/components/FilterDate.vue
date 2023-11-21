<template>
  <span class="p-float-label w-100">
    <Calendar
      v-model="dates"
      inputId="date-range-read"
      dateFormat="dd/mm/yy"
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

// const valFormated = computed(() => moment(dates.value).format(props.dateFormat));
const dates = ref();

const emit = defineEmits(["update:modelValue"]);

watch(dates, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    if (typeof val === "string" && val != dates.value) {
      const formattedDate = moment(val).format("DD/MM/YYYY hh:00");

      dates.value = formattedDate;
    }
  },
  { immediate: true }
);
</script>
