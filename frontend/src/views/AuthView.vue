<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" class="my-4" />
    <AuthForm :is-logging="isLogging">
      <ButtonsAuth :is-logging="isLogging" />
    </AuthForm>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import AuthForm from "@/components/AuthForm.vue"; // @ is an alias to /src
import ButtonsAuth from "@/components/ButtonsAuth.vue"; // @ is an alias to /src
import { computed, Ref, ref, watch } from "vue";

const route = useRoute();

const name = computed(() => route.name);
let isLogging: Ref<boolean> = ref(name.value == "login");
watch(name, (name) => {
  isLogging.value = name == "login";
});
</script>
