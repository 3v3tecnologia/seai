<template>
  <div class="wrapper-logo">
    <router-link :to="{ name: 'home' }">
      <h1 class="main-logo mb-0" :class="props.titleSize">SEAI</h1>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
  titleSize: {
    type: String,
    default: "lg",
  },
});
</script>

<style lang="scss" scoped>
.wrapper-logo {
  * {
    text-decoration: none !important;
  }

  .main-logo {
    font-family: "Secular One", sans-serif;

    color: hsl(205 100% 20% / 1);

    &.lg {
      font-size: 4rem;
      letter-spacing: 0.4rem;
    }

    &.md {
      font-size: 2rem;
      letter-spacing: 0.2rem;
    }
  }
}
</style>
