<template>
  <div class="px-lg-5 mx-lg-5">
    <div
      class="users-count d-flex align-items-center justify-content-between p-lg-5 mb-5"
    >
      <div
        class="wrapper-counter"
        v-for="counter in usersCount"
        :key="counter.title"
      >
        <div class="counter">
          {{ users?.[counter.key] }}
        </div>
        <div class="label">
          {{ counter.title }}
        </div>
      </div>
    </div>

    <div class="mb-3 d-flex justify-content-end">
      <div class="btn btn-base">
        <router-link :to="{ name: 'create-user' }">
          Adicionar novo usuário
        </router-link>
      </div>
    </div>

    <UsersTable :users="users.data" v-model="filtersUsers" />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import UsersTable from "@/components/UsersTable.vue";
import { computed, ref, watch } from "vue";

const store = useStore();
const filtersUsers = ref({});

watch(
  filtersUsers,
  (val) => {
    store.dispatch("GET_USERS", val);
  },
  { immediate: true }
);

const users = computed(() => store.state.users);

const usersCount = [
  {
    key: "totalAdmins",
    title: "Administradores",
  },
  {
    key: "totalBasics",
    title: "Básicos",
  },
  {
    key: "totalActives",
    title: "Ativos",
  },
  {
    key: "totalInactives",
    title: "Inativos",
  },
];
</script>

<style lang="scss" scoped>
.btn-base {
  background-color: hsl(205deg 83% 20% / 60%);
  color: white !important;

  * {
    color: inherit !important;
  }
}

.users-count {
  background: rgba(203, 197, 197, 0.529);
  border-radius: 5px;
  border: 1px solid black;

  .wrapper-counter {
    display: flex;
    flex-direction: column;
    color: black;

    .counter {
      font-weight: bold;
      font-size: 2rem;
    }

    .label {
      font-size: 1.1rem;
    }
  }
}
</style>
