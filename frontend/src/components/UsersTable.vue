<template>
  <div>
    <div class="px-3 px-lg-5">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th v-for="column in columns" :key="column.title" scope="col">
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in users?.data" :key="user.id">
            <th scope="row">{{ i }}</th>

            <td v-for="column in columns" :key="column.title" scope="col">
              {{ user[column.key] }}
            </td>

            <td>
              <span>...</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { computed, ref, watch } from "vue";

const filtersUsers = ref({
  search: null,
  usersType: null,
  page: 1,
});

import { useStore } from "vuex";

const store = useStore();

watch(
  filtersUsers,
  (val) => {
    store.dispatch("GET_USERS", val);
  },
  { immediate: true }
);

const users = computed(() => store.state.users);

console.log(users);

const columns = [
  {
    title: "Nome",
    key: "name",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Data de criação",
    key: "created_at",
  },
  {
    title: "Função",
    key: "role",
  },
  {
    title: "Status",
    key: "status",
  },
];
</script>
