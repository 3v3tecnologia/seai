<template>
  <div class="mb-5 pb-5">
    <div class="py-4" />

    <LogoProject />

    <div class="py-3"></div>
    <FormWrapper title="Criar novo usuário" @submit="handleSubmit">
      <template v-if="!savedAccount" v-slot:content>
        <div class="py-2"></div>
        <BaseInput
          label="Email"
          v-model="form.email"
          placeholder="Insira um email"
          input-required
          input-type="email"
        />

        <div class="py-2" />

        <BaseSelect
          label="Tipo de usuário"
          v-model="form.type_user"
          placeholder="Sua senha"
          :options="optionsUser"
          input-required
          input-type="password"
        />

        <div class="py-3" />

        <AccessModulesTable />
      </template>
      <template v-else v-slot:content>
        <div class="pt-3 pb-5">
          <div class="mb-2">Conta criada com sucesso.</div>
          <div>
            Email de login enviado para
            <span class="font-weight-bold mr-1">{{
              previewEmailCensured(form.email)
            }}</span
            >.
          </div>
        </div>
      </template>

      <template v-slot:buttons>
        <PrimaryButton
          :text="`${
            savedAccount ? 'Voltar ao listamento de usuários' : 'Salvar usuário'
          }`"
        />
      </template>
    </FormWrapper>
  </div>
</template>

<script lang="ts" setup>
import LogoProject from "@/components/LogoProject.vue";
import AccessModulesTable from "@/components/AccessModulesTable.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { previewEmailCensured } from "@/helpers/formatEmail";
import { defineProps } from "vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const currentRoute = useRoute();
const store = useStore();

const optionsUser: { title: string; value: number }[] = [
  { title: "Básico", value: 0 },
  { title: "Admin", value: 1 },
];

const optionsAccess: { title: string; value: number }[] = [
  { title: "Notícias leitura", value: 0 },
  { title: "Notícias escrita", value: 1 },
  { title: "Equipamentos leitura", value: 0 },
  { title: "Equipamentos escrita", value: 1 },
  { title: "Usuários leitura", value: 0 },
  { title: "Usuários escrita", value: 1 },
];

const form: Ref = ref({
  type_user: optionsUser[0].title,
});
const savedAccount: Ref = ref(false);
const token = ref(currentRoute.query.token || "");

const handleSubmit = (e) => {
  e.preventDefault();

  if (savedAccount.value === true) {
    return router.push({ name: "users" });
  }

  const { name, login, password, confirm_password } = form.value;

  store.dispatch("CREATE_ACCOUNT", form.value).then(() => {
    savedAccount.value = true;
  });
};
</script>
