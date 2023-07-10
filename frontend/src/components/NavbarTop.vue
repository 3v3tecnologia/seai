<template>
  <div class="d-flex flex-column align-items-start mb-5">
    <div class="p-3 d-flex align-items-center justify-content-between w-100">
      <LogoProject title-size="md" />

      <div class="font-weight-bold pl-3">
        <div
          class="d-flex align-items-center justify-content-center"
          v-if="auth?.login"
        >
          <div class="mr-2 mr-lg-3 text-decoration-none">
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

    <div class="px-3 w-100">
      <div class="pb-2 d-flex w-100 justify-content-between">
        <div class="d-flex flex-column flex-lg-row w-100">
          <div v-for="(routes, i) in slicedRoutes" :key="i" class="w-100">
            <div
              class="d-flex px-5 align-items-center justify-content-between w-100"
            >
              <router-link
                v-for="itemRoute in routes"
                :key="itemRoute.name"
                :to="{ name: itemRoute.name }"
                class="my-2 my-lg-0 btn btn-base modif-outline"
              >
                <div class="mb-0">
                  {{ itemRoute.title }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LogoProject from "@/components/LogoProject.vue";
import { ref } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentRouteName = route.name;

const store = useStore();

const auth = computed(() => store.state.auth);

const signOut = () => store.dispatch("SIGN_OUT");

const itemsRoutes = [
  {
    title: "Mapa",
    name: "login",
  },
  {
    title: "Relatórios",
    name: "reports",
  },
  {
    title: "Gráficos",
    name: "login",
  },
  {
    title: "Cadastro",
    name: "login",
  },
  {
    title: "Notícias",
    name: "login",
  },
  // {
  //   title: "Mapa",
  //   name: "map",
  // },
  // {
  //   title: "Relatórios",
  //   name: "users",
  // },
  // {
  //   title: "Gráficos",
  //   name: "graphics",
  // },
  // {
  //   title: "Cadastro",
  //   name: "register",
  // },
  // {
  //   title: "Notícias",
  //   name: "news",
  // },
  {
    title: "Usuários",
    name: "users",
  },
];

const slicedRoutes = [];
const sliceCount = 3;
const arrRowsCount = Math.ceil(itemsRoutes.length / 3);

for (let i = 0; i < arrRowsCount; i++) {
  const slicedItem = [];

  for (let j = 0; j < sliceCount; j++) {
    const indexToPush = i * sliceCount + j;

    slicedItem[j] = itemsRoutes[indexToPush];
  }

  slicedRoutes.push(slicedItem);
}
</script>

<style lang="scss" scoped>
.nav-item {
  &,
  & > * {
    transition: all 0.3;
    color: black !important;
  }

  &:hover {
    text-decoration: underline !important;
  }

  &.router-link-exact-active {
    .chip-route {
      background-color: hsl(205deg 83% 20% / 60%);
      color: white !important;
    }
  }
}
</style>
