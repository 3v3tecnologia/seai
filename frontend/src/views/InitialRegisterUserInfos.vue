<template>
  <div class="home">
    <div class="py-4" />

    <div class="py-3" />
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
          v-model="form.confirmPassword"
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
import { toast } from "vue3-toastify";

const router = useRouter();
const currentRoute = useRoute();
const store = useStore();

const form: Ref = ref({});
const savedAccount: Ref = ref(false);
const token = ref(currentRoute.query.token || "");

const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (savedAccount.value === true) {
    return router.push({ name: "login" });
  }
  const validatedForm = validateForm(form.value);

  if (validatedForm) {
    await store
      .dispatch("INITIAL_REGISTER", {
        ...form.value,
        token: token.value,
      })
      .then(() => {
        savedAccount.value = true;
      });
  }
};

const validateForm = ({
  name,
  password,
  confirmPassword,
  login,
}: {
  [x: string]: string;
}) => {
  const hasEmptyValue =
    [name, password, confirmPassword, login].findIndex((c) => !c) >= 0;
  const isPasswordsUnMatching = password != confirmPassword;

  if (hasEmptyValue) {
    toast.error("Preencha todos os campos");
    return false;
  } else if (isPasswordsUnMatching) {
    toast.error("Senhas estão divergindo");
    return false;
  }

  return true;
};
</script>
