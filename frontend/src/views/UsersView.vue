<template>
  <div>
    <router-link :to="{ name: 'create-user' }"> Criar usuário </router-link>

    <UsersTable />
  </div>
</template>

<script lang="ts" setup>
import UsersTable from "@/components/UsersTable.vue";
</script>
