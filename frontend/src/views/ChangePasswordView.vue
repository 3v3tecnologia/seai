<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" class="my-4" />

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
          input-required
        />

        <BaseInput
          label="Confirmar nova senha"
          v-model="form.confirm_password"
          placeholder="Confirme sua nova senha"
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
  </div>
</template>

<script lang="ts" setup>
import BaseInput from "@/components/BaseInput.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { defineProps } from "vue";
import { IUser } from "@/interfaces/IUser";
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

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

  store
    .dispatch("CHANGE_PASSWORD", {
      password,
      token,
    })
    .then((r) => {
      changedPassword.value = true;
    });
};
</script>
