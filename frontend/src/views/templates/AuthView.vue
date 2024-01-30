<template>
  <div class="home">
    <LogoProject />

    <div class="py-3"></div>

    <AuthForm :is-logging="isLogging">
      <ButtonsAuth :is-logging="isLogging" />
    </AuthForm>
  </div>

  <div class="my-5 py-5"></div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import AuthForm from "@/components/AuthForm.vue"; // @ is an alias to /src
import LogoProject from "@/components/LogoProject.vue"; // @ is an alias to /src
import ButtonsAuth from "@/components/ButtonsAuth.vue"; // @ is an alias to /src
import { computed, Ref, ref, watch } from "vue";

const route = useRoute();

const name = computed(() => route.name);
let isLogging: Ref<boolean> = ref(name.value == "login");
watch(name, (name) => {
  isLogging.value = name == "login";
});
</script>
