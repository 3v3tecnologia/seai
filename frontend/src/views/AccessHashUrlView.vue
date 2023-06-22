<template>
  <div class="p-5 h2 mt-5">
    {{ urlAccessed?.value?.url_basic }}
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const router = useRouter();

const hashParam = computed(() => route.params.catchAll);
let urlAccessed = computed(() => store.state.url_accessed);

let urlBasic = "";

if (hashParam.value) {
  store.dispatch("FETCH_URL_ACCESSED", hashParam.value).then(() => {
    if (urlAccessed.value) {
      store.dispatch("SEND_ACCESS_LOG", urlAccessed.value.url_register_id);
      urlBasic = urlAccessed.value.url_basic;

      window.location.href = urlBasic;

      return true;
    } else {
      router.push({ name: "not-found-page" });
    }
  });

  // const { url_basic: urlBasic } = urlAccessed?.value;

  // try {
  //   window.location.replace(urlBasic);
  // } catch (e) {
  //   alert("Url inválida");
  // }
}
</script>
