<template>
  <div class="d-flex flex-column align-items-start">
    <span class="label-access"> Acessar </span>
    <div class="mt-3">
      <router-link
        class="nav p-2"
        v-for="(route, i) in routes"
        :key="i"
        :to="route.name"
      >
        {{ route.label }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  routes: {
    required: true,
    type: Array,
  },
});
</script>

<style lang="scss">
.label-access {
  color: #6c757d;
  font-size: 1.1rem;
}

.nav {
  border: 1px solid #6c757d;
  border-radius: 5px;
  background-color: $gov-blue !important;
  color: white;

  &:hover {
    color: white !important;
    background-color: $gov-blue-light !important;
    // filter: grayscale(1);
    text-decoration: none !important;
  }

  &,
  &:hover {
    transition: all 0.3s;
  }
}
</style>
