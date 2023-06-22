<template>
  <div class="d-flex flex-column justify-content-center">
    <button type="submit" class="btn btn-success px-4 py-2">
      {{ mainItem.text }}
    </button>
    <div class="d-flex align-items-center justify-content-center pt-4">
      <router-link :to="secondaryItem.routeName" class="ml-3 text-dark">
        {{ secondaryItem.text }}
      </router-link>
      <router-link to="/" class="ml-3 text-dark">
        Continuar sem sessão
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from "vue";
const props = defineProps({
  isLogging: Boolean,
});

const texts = [
  {
    text: "Entrar",
    routeName: "/login",
  },
  {
    text: "Recuperar conta",
    routeName: "retrieve-account",
  },
];

let mainItem = ref(texts[0]);
let secondaryItem = ref(texts[1]);

watch(
  () => props.isLogging,
  (isLogging) => {
    if (isLogging) {
      [mainItem.value, secondaryItem.value] = texts;
    } else {
      [secondaryItem.value, mainItem.value] = texts;
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.btn {
  &:hover {
    cursor: pointer;
  }
}
</style>
