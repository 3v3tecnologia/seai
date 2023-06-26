<template>
  <div class="home">
    <div class="py-4" />

    <LogoProject />

    <div class="py-3"></div>
    <FormWrapper title="Registrar conta" @submit="handleSubmit">
      <template v-if="!savedAccount" v-slot:content>
        <div class="py-2"></div>
        <BaseInput
          label="Nome"
          v-model="form.name"
          placeholder="Insira um nome"
          input-required
        />

        <BaseInput
          label="Login"
          v-model="form.login"
          placeholder="Insira um login"
          input-required
        />

        <div class="py-2" />
        <BaseInput
          label="Senha"
          v-model="form.password"
          placeholder="Sua senha"
          input-required
          input-type="password"
        />

        <BaseInput
          label="Confirmar senha"
          v-model="form.confirm_password"
          placeholder="Confirme sua senha"
          input-required
          input-type="password"
        />
      </template>
      <template v-else v-slot:content>
        <div class="pt-3 pb-5">Conta criada com sucesso.</div>
      </template>

      <template v-slot:buttons>
        <PrimaryButton
          :text="`${savedAccount ? 'Realizar login' : 'Salvar dados'}`"
        />
      </template>
    </FormWrapper>
  </div>
</template>

<script lang="ts" setup>
import LogoProject from "@/components/LogoProject.vue";
import BaseInput from "@/components/BaseInput.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { defineProps } from "vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const currentRoute = useRoute();
const store = useStore();

const form: Ref = ref({});
const savedAccount: Ref = ref(false);
const token = ref(currentRoute.query.token || "");

const handleSubmit = (e) => {
  e.preventDefault();

  if (savedAccount.value === true) {
    return router.push({ name: "login" });
  }

  const { name, login, password, confirm_password } = form.value;

  store
    .dispatch("CHANGE_PASSWORD", {
      password,
      token,
    })
    .then(() => {
      savedAccount.value = true;
    });
};
</script>
