<template>
  <div class="d-flex flex-column align-items-start mb-5">
    <div
      class="p-3 bg-white d-flex align-items-center justify-content-between w-100"
    >
      <LogoProject title-size="md" />
      <div class="align-items-center d-flex font-weight-bold pl-3">
        <div
          class="d-flex align-items-center justify-content-center"
          v-if="auth?.login"
        >
          <router-link
            to="/profile"
            class="d-flex align-items-center justify-content-center"
          >
            <i class="pi pi-user pr-2" style="color: #708090"></i>
            <div class="mr-2 mr-lg-3 text-decoration-none">
              {{ auth.login }}
            </div>
          </router-link>
          <div @click="signOut" class="wrapper-sign-out">
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

    <div v-if="auth?.login" class="w-100">
      <TabMenu v-model:activeIndex="active" :model="itemsRoutes" class="mb-2">
        <template #item="{ label, item, props }">
          <router-link
            v-if="item.route"
            v-slot="routerProps"
            :to="item.route"
            class="h-100"
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
import LogoProject from "@/components/videntity/LogoProject.vue";
import { modulesSystem } from "@/constants";
import { ref } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import routes from "@/router/routes";

const router = useRouter();
const route = useRoute();

const currentRouteName = route.name;

const store = useStore();

const auth = computed(() => store.state.auth);
const authUser = computed(() => store.state.profile);

const signOut = () => store.dispatch("SIGN_OUT");

const active = computed({
  set(val) {
    // store.commit("SET_CURRENT_TAB", val);
  },
  get() {
    return store.state.currentTab;
  },
});

const itemsRoutesRaw = routes
  .filter((f: any) => f.meta?.ShowNav)
  .map((f) => {
    return {
      label: f.meta?.title,
      route: f.path,
      navBarTab: f?.meta?.navBarTab,
      modulesNeeded: f?.meta?.modulesNeeded?.[0] ?? null,
    };
  })
  .sort((a, b) => a.navBarTab - b.navBarTab);

const itemsRoutes = computed(() =>
  itemsRoutesRaw.map((v: any) => {
    if (v.modulesNeeded && !authUser.value?.modules[v?.modulesNeeded]?.read) {
      v.disabled = true;
    } else {
      v.disabled = false;
    }
    return v;
  })
);
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

.p-menuitem-link {
  height: 100%;
}

// .disabled-tab {
//   opacity: 0.5;
//   pointer-events: none;
// }
</style>
