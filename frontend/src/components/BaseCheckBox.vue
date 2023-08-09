<template>
  <div>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="checkbox"
        id="inlineCheckbox1"
        value="option1"
      />
      <label class="form-check-label" for="inlineCheckbox1">1</label>
    </div>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="checkbox"
        id="inlineCheckbox2"
        value="option2"
      />
      <label class="form-check-label" for="inlineCheckbox2">2</label>
    </div>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="checkbox"
        id="inlineCheckbox3"
        value="option3"
        disabled
      />
      <label class="form-check-label" for="inlineCheckbox3">3 (disabled)</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, Ref, watch } from "vue";

const props = defineProps({
  label: String,
  modelValue: Object,
  inputRequired: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inlineLabel: {
    type: Boolean,
    default: false,
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
    console.log("mudou valor do modelval", val, val?.title);
    inputValue.value = val?.title || 0;
  },
  { immediate: true, deep: true }
);

const emit = defineEmits(["update:modelValue"]);

watch(
  () => props.disabled,
  (val) => {
    if (val) {
      emit("update:modelValue", props.options[0]);
    }
  }
);

watch(inputValue, (val) => {
  emit(
    "update:modelValue",
    props.options.find((opt) => opt.title == val)
  );
});
</script>

<style lang="scss" scoped>
.wrapper-select {
  label {
    font-weight: bold;
  }

  &.inline-label {
    display: flex;
    align-items: center;

    label {
      margin-right: 1.3rem;
      margin-bottom: 0 !important;
      text-wrap: nowrap;
    }

    select {
      min-width: 200px;
      width: 100%;
      max-width: 200px;
    }
  }
}
</style>
