<template>
  <div class="mx-3">
    <!-- <RegisterUrl /> -->
    <div class="mt-4">
      <div class="row">
        <div class="col-12 d-flex mb-4 mb-lg-3">
          <h2 class="d-none d-lg-block">
            {{ titlePage }}
          </h2>
          <h3 class="d-lg-none">
            {{ titlePage }}
          </h3>
        </div>
      </div>
      <!-- <div class="p-3 rounded-bottom rounded-top">
        <div v-if="!urls.length" class="p-2 py-5 h5">Lista vazia</div>
        <UrlsTable v-else :urls="urls" />
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import RegisterUrl from "@/components/RegisterUrl";
import UrlsTable from "@/components/UrlsTable";

import { useStore } from "vuex";
import { computed, watch } from "vue";

const store = useStore();

const urls = computed(() => store.state.urls);
const auth = computed(() => store.state.auth);

const titlePage = "Página inicial";

watch(
  auth,
  () => {
    if (auth.value?.token) {
      store.dispatch("FETCH_USER_URL");
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
