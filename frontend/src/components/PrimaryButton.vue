<template>
  <button
    @click="handleClick"
    type="submit"
    class="btn btn-success px-4 py-2 btn-block"
  >
    {{ props.text }}
  </button>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["click"]);

const handleClick = (e) => {
  emit("click", e);
};

const props = defineProps({
  text: String,
});
</script>

<style lang="scss" scoped>
.btn {
  &:hover {
    cursor: pointer;
  }
}
</style>
