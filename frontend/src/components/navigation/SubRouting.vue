<template>
  <div class="d-flex flex-column align-items-start">
    <span class="label-access"> Acessar </span>
    <div class="wrapper-routes d-flex mt-2">
      <router-link
        v-for="(route, i) in routesShowing"
        :key="i"
        :to="route.name"
        :class="{ disabled: route.disabled }"
        class="nav p-2"
      >
        {{ route.label }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { useRoute } from "vue-router";

const router = useRoute();
const currentRoute = computed(() => router.name);

const routesShowing = computed(() =>
  props.routes
    .map((route) => {
      route.disabled = route.name === currentRoute.value;
      return route;
    })
    .sort((a, b) => a.disabled - b.disabled)
);

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

  &.disabled {
    pointer-events: none !important;
    filter: grayscale(70);
  }
}

.wrapper-routes {
  & > :not(:first-child) {
    margin-left: 1rem;
    display: inline-block;
  }
}
</style>
