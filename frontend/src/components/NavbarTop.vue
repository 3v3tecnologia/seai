<template>
  <div class="py-4 d-flex w-100 justify-content-between">
    <div class="d-flex align-items-center">
      <router-link
        v-for="(itemRoute, index) in itemsRoutes"
        :key="itemRoute.path"
        :to="itemRoute.path"
        :class="`${index != itemsRoutes.length - 1 ? 'pr-2 mx-4' : ''}`"
        class="nav-item"
      >
        <div class="h6">{{ itemRoute.name }}</div>
      </router-link>
    </div>
    <div class="nav-item font-weight-bold px-4">
      <div
        class="d-flex align-items-center justify-content-center"
        v-if="auth?.login"
      >
        <div class="mr-2 mr-lg-3">
          {{ auth.login }}
        </div>
        <div @click="signOut">
          <router-link to="/login">
            <font-awesome-icon
              class="text-danger"
              icon="fa-solid fa-sign-out"
            />
          </router-link>
        </div>
      </div>
      <router-link to="/login" v-else> Login </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const auth = computed(() => store.state.auth);

const signOut = () => store.dispatch("SIGN_OUT");

const itemsRoutes = ref([
  {
    name: "Início",
    path: "/",
  },
  {
    name: "Top 100",
    path: "/most-accessed",
  },
]);
</script>

<style lang="scss" scoped>
.nav-item {
  &,
  & > * {
    transition: 0.3 all;
    color: rgb(22, 95, 22) !important;
  }

  &:hover {
    color: rgb(49, 148, 49) !important;
    text-decoration: none !important;
  }
}
</style>
