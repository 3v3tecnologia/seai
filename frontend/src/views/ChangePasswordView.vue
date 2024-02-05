<template>
  <div class="home">
    <FormWrapper title="Mudar senha" @submit="handleSubmit">
      <template v-if="!changedPassword" v-slot:content>
        <div class="mb-3 mt-4">
          Com objetivo de protejer a sua conta, tenha certeza que sua senha
          possui:
        </div>

        <ul>
          <li>Mais de 6 caracteres</li>
          <li>Contém letras, números e símbolos</li>
          <li>Não combina com seu login, nome</li>
        </ul>

        <div class="py-2"></div>
        <BaseInput
          label="Nova senha"
          v-model="form.password"
          placeholder="Sua nova senha"
          input-type="password"
          input-required
        />

        <BaseInput
          label="Confirmar nova senha"
          v-model="form.confirmPassword"
          placeholder="Confirme sua nova senha"
          input-type="password"
          input-required
        />
      </template>
      <template v-else v-slot:content>
        <div class="pt-3 pb-5">Senha trocada com sucesso.</div>
      </template>

      <template v-slot:buttons>
        <PrimaryButton
          :text="`${changedPassword ? 'Realizar login' : 'Salvar senha'}`"
        />
      </template>
    </FormWrapper>

    <div class="py-5"></div>
  </div>
</template>

<script lang="ts" setup>
import LogoProject from "@/components/videntity/LogoProject.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import PrimaryButton from "@/components/form/PrimaryButton.vue";
import FormWrapper from "@/components/form/FormWrapper.vue";
import { defineProps } from "vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { validatePasswords } from "@/helpers/charts";

const router = useRouter();
const currentRoute = useRoute();
const store = useStore();

const form: Ref = ref({});
const changedPassword: Ref = ref(false);
const token = ref(currentRoute.query.token || "");

const handleSubmit = (e) => {
  e.preventDefault();

  if (changedPassword.value === true) {
    return router.push({ name: "login" });
  }

  const password = form.value.password;
  const confirmPassword = form.value.password;

  const isValidPassword = validatePasswords(form.value);

  if (!isValidPassword) {
    return;
  }

  store
    .dispatch("CHANGE_PASSWORD", {
      confirmPassword,
      password,
      token: token.value,
    })
    .then(() => {
      changedPassword.value = true;
    })
    .catch(console.error);
};
</script>
