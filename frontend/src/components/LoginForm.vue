<!-- eslint-disable prettier/prettier -->
<template>
<div class="wrapper-form">
  <form @submit="handleSubmit" class="text-left p-4 p-lg-5">
    <div class="form-group">
      <label for="exampleFormControlInput1">Login</label>
      <input v-model="form.login" required type="text" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
    </div>
    <div class="form-group">
      <label for="exampleFormControlInput1">Senha</label>
      <input v-model="form.password" required type="password" class="form-control" id="exampleFormControlInput1" placeholder="sua senha">
    </div>
    
    <div class="d-flex align-items-center justify-content-center pt-4">
      <button type="submit" class="btn btn-success px-4 py-2">Entrar</button>
      <router-link to="/forgot-password" class="ml-3 text-dark">Esqueci minha senha</router-link>
    </div>
  </form>
</div>
</template>

<script lang="ts" setup>
import { LoginUser } from "@/interfaces/auth.ts";
import { ref } from "vue";
import type { Ref } from "vue";

const form: Ref<LoginUser> = ref({});

const handleSubmit = (e) => {
  e.preventDefault();

  console.log("submeteu o form");
  console.log(form.value);
};
</script>

<style lang="scss">
.wrapper-form {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;

  @media (min-width: 992px) {
    max-width: 500px;
    margin: 0 auto;
  }

  form {
    background: $base-blue;

    label {
      font-weight: bold;
    }

    // button
  }
}
</style>
