<template>
  <div>
    <div class="mt-4">
      <div class="p-3 d-flex mb-4 mb-lg-3">
        <div class="wrapper-mock"></div>
      </div>
      <!-- <div class="p-3 rounded-bottom rounded-top">
        <div v-if="!urls.length" class="p-2 py-5 h5">Lista vazia</div>
        <UrlsTable v-else :urls="urls" />
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
const titlePage = "Página inicial";
</script>

<style lang="scss" scoped>
.wrapper-mock {
  background-color: #e4e4e4;
  width: 100%;
  height: 80vh;
}
</style>
