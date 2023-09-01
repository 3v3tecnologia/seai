<template>
  <div class="d-flex flex-column align-items-start mb-5">
    <div
      class="p-3 bg-white d-flex align-items-center justify-content-between w-100"
    >
      <LogoProject title-size="md" />

      <div class="align-items-center d-flex font-weight-bold pl-3">
        <i class="pi pi-user pr-2" style="color: #708090"></i>
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

    <div class="w-100">
      <TabMenu v-model:activeIndex="active" :model="itemsRoutes" class="mb-2">
        <template #item="{ label, item, props }">
          <router-link
            v-if="item.route"
            v-slot="routerProps"
            :to="item.route"
            custom
          >
            <a
              :href="routerProps.href"
              v-bind="props.action"
              @click="($event) => routerProps.navigate($event)"
              @keydown.enter.space="($event) => routerProps.navigate($event)"
            >
              <span v-bind="props.label">{{ label }}</span>
            </a>
          </router-link>
        </template>
      </TabMenu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TabMenu from "primevue/tabmenu";
import LogoProject from "@/components/LogoProject.vue";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const currentRouteName = route.name;

const store = useStore();

const auth = computed(() => store.state.auth);

const signOut = () => store.dispatch("SIGN_OUT");

const active = ref(0);
const itemsRoutesRaw = [
  {
    label: "Usuários",
    route: "/users",
  },
  {
    label: "Relatórios",
    route: "/reports",
  },
  {
    label: "Gráficos",
    route: "/charts",
  },
];

const itemsRoutes = computed(() =>
  itemsRoutesRaw.map((v) => {
    if (!auth.value) {
      v.disabled = true;
    } else {
      v.disabled = false;
    }
    return v;
  })
);

// const slicedRoutes = [];
// const sliceCount = 3;
// const arrRowsCount = Math.ceil(itemsRoutes.length / 3);

// for (let i = 0; i < arrRowsCount; i++) {
//   const slicedItem = [];

//   for (let j = 0; j < sliceCount; j++) {
//     const indexToPush = i * sliceCount + j;

//     slicedItem[j] = itemsRoutes[indexToPush];
//   }

//   slicedRoutes.push(slicedItem);
// }
// onMounted(() => {
//   active.value = slicedRoutes.findIndex(
//     (item) => route.path === router.resolve(item.route).path
//   );
// });

// watch(
//   route,
//   () => {
//     active.value = slicedRoutes.findIndex(
//       (item) => route.path === router.resolve(item.route).path
//     );
//   },
//   { immediate: true }
// );
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
