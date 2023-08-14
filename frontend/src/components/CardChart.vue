<template>
  <div
    :class="{ 'd-flex align-items-center justify-content-center': isCentered }"
    class="wrapper-card w-100 p-2 p-lg-4 h-100"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
const props = defineProps({
  isCentered: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.wrapper-card {
  box-shadow: 0px 1px 22px -12px #607d8b;
  background: white;
}
</style>
