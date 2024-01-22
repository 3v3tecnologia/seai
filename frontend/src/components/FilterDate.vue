<template>
  <span class="p-float-label w-100 margin-top-mob wrapper-filter">
    {{ dates }}
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
      :stepMinute="stepMinute"
    />
    <!-- show-button-bar="true" -->
    <label for="date-range-read">{{ label }}</label>
    <button
      @click="clearDates"
      v-if="canClear && dates?.length"
      class="clear d-flex align-items-center justify-content-center"
    >
      <i class="pi pi-times text-white"></i>
    </button>
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
  stepMinute: {
    default: 60,
    type: Number,
  },
  dateFormat: {
    default: "YYYY-MM-DD",
    type: String,
  },
  canClear: {
    default: false,
    type: Boolean,
  },
});

// const valFormated = computed(() => moment(dates.value).format(props.dateFormat));
const dates = ref();

const emit = defineEmits(["update:modelValue"]);

watch(dates, (val) => {
  let emitedVal = val;

  if (typeof val != "string" && !emitedVal?.length) {
    emitedVal = [];
  }

  emit("update:modelValue", emitedVal);
});

watch(
  () => props.modelValue,
  (val) => {
    if (typeof val === "string" && val != dates.value) {
      const formattedDate = moment(val).format("DD/MM/YYYY HH:00");

      dates.value = formattedDate;
    }
  },
  { immediate: true }
);

const clearDates = () => (dates.value = null);
</script>
<style lang="scss" scoped>
.wrapper-filter {
  position: relative;
  .clear {
    background-color: #6366f1;
    position: absolute;
    top: 0;
    right: 0;
    width: 48px;
    height: 100%;
    z-index: 100;
    border-radius: 6px;
    border: none;

    &,
    &:hover {
      transition: all 0.2s;
    }

    &:hover {
      filter: grayscale(0.2);
      background: #4f46e5;
      color: #ffffff;
      border-color: #4f46e5;
    }
  }
}
</style>
