<template>
  <div class="home mb-5">
    <img alt="Vue logo" src="../assets/logo.png" class="my-4" />
    <h3 class="mb-3">Recuperar conta</h3>

    <p>Enviaremos os dados por email para a recuperação de sua conta</p>

    <AuthForm :is-logging="false">
      <ButtonsAuth :is-logging="false" />
      <div class="mt-5 text-center">
        Caso venha a surgir algum problema ou dúvida, por favor entre em contato
        com a equipe de suporte via email suporte@email.com
      </div>
    </AuthForm>
  </div>
</template>

<script lang="ts" setup>
import AuthForm from "@/components/AuthForm.vue"; // @ is an alias to /src
import ButtonsAuth from "@/components/ButtonsAuth.vue"; // @ is an alias to /src
</script>
