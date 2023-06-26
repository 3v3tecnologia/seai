<template>
  <div>
    <div class="mt-4">
      <div class="p-3 d-flex mb-4 mb-lg-3">
        <div class="wrapper-mock" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const store = useStore();

const auth = computed(() => store.state.auth);

if (!auth.value) {
  router.push({ name: "login" });
}
</script>

<style lang="scss" scoped>
.wrapper-mock {
  background-color: #e4e4e4;
  width: 100%;
  height: 80vh;
}
</style>
