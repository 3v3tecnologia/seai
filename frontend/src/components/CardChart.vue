<template>
  <div class="wrapper-card-total">
    <div
      :class="{
        'd-flex align-items-center justify-content-center': isCentered,
      }"
      class="wrapper-card w-100 p-2 p-lg-4 h-100"
    >
      <slot />
    </div>
    <div
      class="loading d-flex align-items-center justify-content-center"
      :class="{ active: isLoadingReport }"
    >
      <ProgressSpinner />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { useStore } from "vuex";
import ProgressSpinner from "primevue/progressspinner";

defineProps({
  isCentered: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const isLoadingReport = computed(() => store.state.isLoadingReport);
</script>

<style lang="scss" scoped>
.wrapper-card-total {
  position: relative;

  .wrapper-card {
    box-shadow: 0px 1px 22px -12px #607d8b;
    background: white;
  }

  .loading {
    transition: all 0.2s;
    z-index: -1;
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(113 105 105 / 43%);
    top: 0;
    left: 0;

    &.active {
      z-index: 1;
      opacity: 1;
    }
  }
}
</style>
