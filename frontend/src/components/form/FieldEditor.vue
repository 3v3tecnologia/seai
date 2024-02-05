<template>
  <div class="position-relative w-100 mt-4">
    <label class="font-weight-bold label">{{ label }} </label>
    <Editor
      @load="loadedEditor"
      v-model="textValue"
      editorStyle="height: 320px"
    />
    <div class="base-text-length mt-2 text-secondary">
      <span v-if="belowMinimium">
        Caracteres mínimos: {{ minimumLength }}
      </span>
      <span v-else>
        Caracteres disponíveis:
        <span
          :class="{ 'text-danger': !belowMinimium && availableChars <= 5 }"
          >{{ availableChars }}</span
        >
      </span>
    </div>
    <input
      :value="fakeText"
      :pattern="`.{${minimumLength},}`"
      :title="`Mínimo de ${minimumLength} caracteres`"
      required
      class="hidden-input position-absolute"
      name="teste"
      cols="1"
      rows="1"
    />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, computed } from "vue";
import Editor from "primevue/editor";
import { faK } from "@fortawesome/free-solid-svg-icons";

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
const limit = 500;
const minimumLength = 10;
const currentLength = ref(0);

const availableChars = computed(() => limit - currentLength.value + 1);
const belowMinimium = computed(() => currentLength.value < minimumLength + 1);
const fakeText = computed(() => {
  if (currentLength.value === 1) {
    return "A";
  } else if (!currentLength.value) {
    return "";
  } else {
    return "A".repeat(currentLength.value - 1);
  }
});

const loadedEditor = (val) => {
  const quill = val.instance;

  quill.on("text-change", function (delta, old, source) {
    const textLength = quill.getLength();
    currentLength.value = textLength;

    if (textLength > limit) {
      quill.deleteText(limit, textLength);
    }
  });
};

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

.base-text-length {
  font-size: 0.8rem;
}

.hidden-input {
  z-index: -1;
  top: 40%;
  left: 0;
  opacity: 0;
}
</style>
