<template>
  <div
    class="wrapper-card-total h-100"
    :style="{ minHeight: isLoadingReport ? '300px' : '' }"
  >
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
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { useStore } from "vuex";

defineProps({
  isCentered: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const isLoadingReport = computed(() => store.state.report.isLoadingReport);
</script>

<style lang="scss" scoped>
$SPIN-COLOR: white;

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
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  opacity: 0.4;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid $SPIN-COLOR;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $SPIN-COLOR transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
