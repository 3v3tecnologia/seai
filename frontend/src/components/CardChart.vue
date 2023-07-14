<template>
  <!-- wrapper-card p-2 w-100 h-100 d-flex align-items-center justify-content-center" -->

  <div class="wrapper-card w-100 p-2 p-lg-4 h-100">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-card {
  box-shadow: 0px 1px 22px -12px #607d8b;
  background: white;
}
</style>
