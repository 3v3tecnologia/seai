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

        <BaseDropdown
          label="Tipo de usuário"
          v-model="form.type"
          placeholder="Tipo de usuário"
          :options="optionsUser"
          input-required
          input-type="password"
        />

        <div class="py-3" />

        <AccessModulesTable v-model="acessData" />
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

<script setup>
import LogoProject from "@/components/LogoProject.vue";
import AccessModulesTable from "@/components/AccessModulesTable.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseDropdown from "@/components/BaseDropdown.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { previewEmailCensured } from "@/helpers/formatEmail";
import { computed, defineProps, watch } from "vue";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";

const router = useRouter();
const currentRoute = useRoute();
const store = useStore();

const optionsUser = [
  { title: "Básico", value: 0 },
  { title: "Admin", value: 1 },
];

const acessData = ref({});

const form = ref({
  type: optionsUser[0],
});
const savedAccount = ref(false);
const token = ref(currentRoute.query.token || "");

const formDTO = computed(() => {
  return {
    email: form.value.email,
    type: form.value.type.value ? "admin" : "standard",
    modules: acessData.value,
  };
});

const handleSubmit = (e) => {
  e.preventDefault();

  const { email, type } = form.value;
  const hasEmptyForm = [email, type].filter((val) => !val).length;

  if (hasEmptyForm) {
    return toast.warn("Preencha todos os campos.");
  }

  if (savedAccount.value) {
    return router.push({ name: "users" });
  }

  store.dispatch("CREATE_USER", formDTO.value).then(() => {
    savedAccount.value = true;
  });
};
</script>
