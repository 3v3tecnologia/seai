<template>
  <BasicContentWrapper>
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

    <UsersTable
      v-if="users.data.length"
      :get-data="getData"
      :data="users.data"
      v-model="filtersUsers"
    />
  </BasicContentWrapper>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import UsersTable from "@/components/UsersTable.vue";
import BasicContentWrapper from "@/components/BasicContentWrapper.vue";
import { computed, ref } from "vue";

const store = useStore();
const filtersUsers = ref({});

const getData = () => store.dispatch("GET_EQUIPMENTS");

getData();

const users = computed(() => store.state.users);

const usersCount = [
  {
    key: "totalAdmins",
    title: "Estações",
  },
  {
    key: "totalBasics",
    title: "Pluviômetros",
  },
];
</script>

<style lang="scss" scoped>
.users-count {
  background: rgba(203, 197, 197, 0.529);
  border-radius: 5px;
  border: 1px solid black;
  max-width: 800px !important;
  margin: auto;

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
