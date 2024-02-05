<template>
  <div
    class="wrapper-page d-flex flex-column flex-lg-row justify-content-center align-items-center justify-content-lg-center"
  >
    <div
      class="d-flex flex-lg-column mt-4 mt-lg-0 align-items-center align-items-lg-start"
    >
      <div class="h4 mt-2 message-not-found">Página não encontrada</div>

      <div class="mt-2">
        <router-link class="rl-return h3 base-green" to="/">
          Retornar
        </router-link>
      </div>
    </div>
    <div class="d-flex flex-column align-items-end">
      <!-- <img src="../assets/free_404_Error-bro2.svg" alt="image" /> -->
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.wrapper-page {
  height: 100vh;

  img {
    height: 80vh;
    max-width: 100%;
  }

  .message-not-found {
    max-width: 180px;
    text-align: start;
  }

  .rl-return {
    font-weight: bold;
  }

  .base-green {
    color: #49b76e !important;
  }
}
</style>
