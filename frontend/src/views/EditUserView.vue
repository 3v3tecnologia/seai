<template>
  <div class="mb-5 pb-5">
    <div class="py-4" />

    <div class="py-3" />

    <FormWrapper title="Editar usuário" @submit="handleSubmit">
      <template v-if="!savedAccount" v-slot:content>
        <div class="py-2" />
        <BaseInput
          label="Nome"
          v-model="form.name"
          placeholder="Insira um nome"
          input-required
          input-type="nome"
        />
        <div class="py-2" />

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
          v-model="form.role"
          placeholder="Tipo de usuário"
          :options="optionsUser"
          input-required
          input-type="password"
        />

        <div class="py-3" />

        <AccessModulesTable />
      </template>
      <template v-else v-slot:content>
        <div class="pt-3 pb-5">
          <div class="mb-2">
            Dados do usuário {{ form.name }} atualizados com sucesso.
          </div>
        </div>
      </template>

      <template v-slot:buttons>
        <PrimaryButton
          :text="`${
            savedAccount
              ? 'Voltar ao listamento de usuários'
              : 'Salvar mudanças'
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
import BaseDropdown from "@/components/BaseDropdown.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { previewEmailCensured } from "@/helpers/formatEmail";
import { computed, defineProps, onMounted, watch } from "vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";

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
  role: optionsUser[0],
});
const savedAccount: Ref = ref(false);
const userId = ref(currentRoute.params.id || "");

watch(
  () => userId.value,
  (val) => {
    if (val) {
      store.dispatch("GET_CURRENT_USER", val);
    }
  },
  { immediate: true }
);

const currentUser = computed(() => store.state.currentUser);

watch(
  () => currentUser.value,
  (val) => {
    if (val) {
      form.value = val;
      form.value.role = optionsUser.find((o) => o.title == val.role);
    }
  },
  { immediate: true }
);

const handleSubmit = (e) => {
  e.preventDefault();

  const { email, role } = form.value;
  const hasEmptyForm = [email, role].filter((val) => !val).length;

  if (hasEmptyForm) {
    return toast.warn("Preencha todos os campos.");
  }

  if (savedAccount.value) {
    return router.push({ name: "users" });
  }

  store
    .dispatch("UPDATE_USER", form.value)
    .then(() => {
      savedAccount.value = true;
    })
    .catch(console.error);
};
</script>
